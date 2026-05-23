"""
Projectra agent — architect + coder phases.

Streams a structured project plan (summary, mermaid diagram, stack, file
manifest) from Gemini, then per-file code generation. Reuses the
KeyPool, sse() helper, and SDK error-handling pattern from app.py.
"""

import json
import os
import tempfile
import threading
import time
import uuid
from pathlib import Path
from typing import List, Optional

from pydantic import BaseModel, Field
import google.genai as genai
from google.genai import types


class FileSpec(BaseModel):
    path: str = Field(description="Relative path inside the project root")
    purpose: str = Field(description="One-line description of what this file does")
    language: str = Field(description="File language, e.g. python, jsx, json, md, css")


class StackSpec(BaseModel):
    frontend: Optional[str] = None
    backend: Optional[str] = None
    database: Optional[str] = None
    deployment: Optional[str] = None


class ArchitectPlan(BaseModel):
    summary: str = Field(description="One-paragraph project description")
    mermaid: str = Field(description="Mermaid graph TD architecture diagram (use simple ASCII node IDs)")
    stack: StackSpec
    files: List[FileSpec] = Field(description="Complete list of files needed for a runnable project (typically 6-15 files)")
    run_instructions: str = Field(description="Shell commands to install deps and run, e.g. 'npm install && npm run dev'")


ARCHITECT_PROMPT_TEMPLATE = """You are Projectra's Architect.

Design a MINIMAL, runnable project for the user's idea. Output a JSON
object matching the response schema.

Hard rules:
- Generate the SMALLEST possible file list that still runs (target 4-7 files).
  Combine related code into single files. Skip optional configs unless required.
- DO NOT include separate CSS files if Tailwind is in the stack.
- DO NOT include README, LICENSE, .gitignore, or test files — leave those to the user.
- Each file's "purpose" line should be one short sentence.
- Mermaid: `graph TD` with simple node IDs (A, B, FE, BE — no spaces).
- File paths POSIX-style with forward slashes.

User idea: {idea}
Preferred stack: {stack_hint}
"""


CODER_PROMPT_TEMPLATE = """You are writing the file `{path}` for a project.

Project summary: {summary}
Stack: {stack}
File purpose: {purpose}
Language: {language}

Hard rules:
- Output ONLY the raw file contents. No markdown fences, no commentary, no
  "Here's the code:" preamble.
- Keep it MINIMAL — only what's needed for the file to fulfill its purpose
  and the project to run. No defensive checks, no logging, no comments
  unless absolutely required by the language (e.g., shebangs).
- Target under 60 lines where possible.
"""


# project_id -> {dir: Path, created_at: float, stack: dict, run_instructions: str}
PROJECT_STORE: dict = {}
_PROJECT_TTL_SECONDS = 60 * 60  # 1 hour
_PROJECT_STORE_LOCK = threading.Lock()


def _gc_project_store():
    now = time.time()
    expired = []
    with _PROJECT_STORE_LOCK:
        for pid, meta in list(PROJECT_STORE.items()):
            if now - meta["created_at"] > _PROJECT_TTL_SECONDS:
                expired.append((pid, meta["dir"]))
                PROJECT_STORE.pop(pid, None)
    for pid, d in expired:
        try:
            import shutil
            shutil.rmtree(d, ignore_errors=True)
        except Exception:
            pass


def _strip_code_fences(text: str) -> str:
    """Gemini sometimes wraps file contents in ```lang ... ``` despite the
    prompt telling it not to. Strip them defensively."""
    t = text.strip()
    if t.startswith("```"):
        # Drop the opening fence line.
        first_nl = t.find("\n")
        if first_nl != -1:
            t = t[first_nl + 1:]
        if t.endswith("```"):
            t = t[: -3].rstrip()
    return t


def sse_padding():
    """Big leading comment line so proxies (Render, Cloudflare, nginx) flush
    headers immediately and start streaming, instead of buffering small
    responses whole. 2 KB of zero-width-ish padding."""
    return ": " + ("=" * 2048) + "\n\n"


def sse_keepalive():
    """Comment-line ping to keep the SSE connection alive during long
    Gemini round-trips. Comments are ignored by the EventSource parser
    but still travel through the proxy as bytes."""
    return ": keepalive\n\n"


def _code_files(pool, sse, initial_key: str, plan: "ArchitectPlan", project_dir: Path):
    """Generator: stream per-file code and persist to disk.

    Reuses the KeyPool for transparent 429/INVALID failover *between*
    files (we never swap keys mid-stream — that would corrupt output)."""
    stack_str = json.dumps(plan.stack.model_dump(exclude_none=True))
    current_key = initial_key

    for file_index, file_spec in enumerate(plan.files):
        # Brief gap to dodge per-minute RPM ceilings on the free tier.
        if file_index > 0:
            for _ in range(8):  # ~1.6s of heartbeats so the proxy doesn't time out
                yield sse_keepalive()
                time.sleep(0.2)

        path = file_spec.path
        yield sse({"type": "file_start", "path": path, "language": file_spec.language})

        prompt = CODER_PROMPT_TEMPLATE.format(
            path=path,
            summary=plan.summary,
            stack=stack_str,
            purpose=file_spec.purpose,
            language=file_spec.language,
        )

        # Try with the current key; on 429/INVALID, mark cooled and rotate.
        # Cap attempts at the pool size + 1 so we don't loop forever.
        max_attempts = max(len(pool), 1) + 1
        chunks: list[str] = []
        wrote_any_chunk = False
        succeeded = False
        last_error = None

        for attempt in range(max_attempts):
            if not current_key:
                last_error = "All API keys exhausted."
                break

            try:
                client = genai.Client(api_key=current_key)
                stream = client.models.generate_content_stream(
                    model="gemini-2.5-flash",
                    contents=prompt,
                )
                for chunk in stream:
                    if chunk.text:
                        chunks.append(chunk.text)
                        wrote_any_chunk = True
                        yield sse({"type": "file_chunk", "path": path, "code": chunk.text})
                succeeded = True
                break

            except genai.errors.ClientError as e:
                msg = str(e)
                if wrote_any_chunk:
                    # Mid-stream failure — don't switch keys (would corrupt the
                    # file). Surface the error and move on to the next file.
                    last_error = f"Interrupted mid-stream: {msg[:200]}"
                    break
                if e.code == 429:
                    pool.mark_failed(current_key, "quota")
                    new_key = pool.acquire()
                    if not new_key:
                        last_error = "All keys are rate-limited."
                        break
                    current_key = new_key
                    yield sse({"type": "info", "message": f"Rate-limited; rotated to next key for {path}"})
                    continue
                if e.code == 400 and "API_KEY_INVALID" in msg:
                    pool.mark_failed(current_key, "invalid")
                    new_key = pool.acquire()
                    if not new_key:
                        last_error = "All keys invalid."
                        break
                    current_key = new_key
                    continue
                last_error = msg[:300]
                break
            except Exception as e:
                last_error = str(e)[:300]
                break

        if not succeeded:
            yield sse({"type": "file_error", "path": path, "error": last_error or "Unknown failure"})
            # Persist an empty placeholder so the ZIP still includes the path.
            abs_path = project_dir / path
            abs_path.parent.mkdir(parents=True, exist_ok=True)
            abs_path.write_text(f"// {path}: generation failed — {last_error or 'unknown'}\n", encoding="utf-8")
            continue

        # Persist (after stripping any rogue fences).
        full = _strip_code_fences("".join(chunks))
        abs_path = project_dir / path
        abs_path.parent.mkdir(parents=True, exist_ok=True)
        abs_path.write_text(full, encoding="utf-8")

        yield sse({"type": "file_end", "path": path, "bytes": len(full.encode("utf-8"))})


def build_architect_event_stream(pool, sse, idea: str, stack_hint: str = "auto"):
    """Generator yielding SSE frames for the architect phase.

    pool: KeyPool instance from app.py
    sse: the sse() helper from app.py (json -> "data: ...\\n\\n" string)
    """
    # Force the proxy (Render, Cloudflare, nginx) to flush headers immediately.
    yield sse_padding()

    if len(pool) == 0:
        yield sse({"type": "error", "error": "No Gemini API keys configured.", "done": True})
        return

    prompt = ARCHITECT_PROMPT_TEMPLATE.format(
        idea=idea.strip(),
        stack_hint=stack_hint if stack_hint and stack_hint != "auto" else "choose the most appropriate modern stack",
    )

    for _ in range(len(pool)):
        key = pool.acquire()
        if not key:
            yield sse({"type": "error", "error": "All API keys are rate-limited. Try again shortly.", "done": True})
            return

        try:
            client = genai.Client(api_key=key)
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ArchitectPlan,
                ),
            )

            plan_dict = json.loads(response.text)
            plan = ArchitectPlan(**plan_dict)

            project_id = str(uuid.uuid4())

            yield sse({
                "type": "plan",
                "summary": plan.summary,
                "stack": plan.stack.model_dump(exclude_none=True),
                "run_instructions": plan.run_instructions,
                "project_id": project_id,
            })
            yield sse({"type": "diagram", "mermaid": plan.mermaid})
            yield sse({
                "type": "manifest",
                "files": [f.model_dump() for f in plan.files],
            })
            yield sse({"type": "architect_done", "project_id": project_id})

            # Phase 2 — coder: generate each file in turn, persist to tempdir.
            project_dir = Path(tempfile.mkdtemp(prefix="projectra_"))
            PROJECT_STORE[project_id] = {
                "dir": project_dir,
                "created_at": time.time(),
                "stack": plan.stack.model_dump(exclude_none=True),
                "run_instructions": plan.run_instructions,
            }
            yield from _code_files(pool, sse, key, plan, project_dir)
            yield sse({"type": "done", "project_id": project_id})
            return

        except genai.errors.ClientError as e:
            msg = str(e)
            if e.code == 429:
                pool.mark_failed(key, "quota")
                continue
            if e.code == 400 and "API_KEY_INVALID" in msg:
                pool.mark_failed(key, "invalid")
                continue
            yield sse({"type": "error", "error": msg, "done": True})
            return
        except Exception as e:
            yield sse({"type": "error", "error": str(e), "done": True})
            return

    yield sse({"type": "error", "error": "All API keys are rate-limited. Try again shortly.", "done": True})
