import json
import os
import threading
import time

import google.genai as genai
from dotenv import load_dotenv
from flask import Flask, Response, request, stream_with_context
from flask_cors import CORS

load_dotenv(override=True)


def load_keys():
    raw = os.getenv("GEMINI_API_KEYS")
    if raw:
        keys = [k.strip() for k in raw.split(",") if k.strip()]
        if keys:
            return keys
    single = os.getenv("GEMINI_API_KEY")
    return [single.strip()] if single and single.strip() else []


class KeyPool:
    QUOTA_COOLDOWN = 60
    INVALID_COOLDOWN = 3600

    def __init__(self, keys):
        self._keys = keys
        self._idx = 0
        self._cooldown = {}
        self._lock = threading.Lock()

    def __len__(self):
        return len(self._keys)

    def acquire(self):
        if not self._keys:
            return None
        now = time.time()
        with self._lock:
            for _ in range(len(self._keys)):
                key = self._keys[self._idx % len(self._keys)]
                self._idx = (self._idx + 1) % len(self._keys)
                if self._cooldown.get(key, 0) <= now:
                    return key
        return None

    def mark_failed(self, key, kind):
        delay = self.QUOTA_COOLDOWN if kind == "quota" else self.INVALID_COOLDOWN
        with self._lock:
            self._cooldown[key] = time.time() + delay


POOL = KeyPool(load_keys())

app = Flask(__name__)
CORS(app, resources={r"/api/*": {
    "origins": "*",
    "allow_headers": ["Content-Type"],
    "expose_headers": ["Content-Type"],
    "supports_credentials": False
}})

SYSTEM_PROMPTS = {
  "normal": """You are Projectra AI, a futuristic AI developer
assistant for engineering students and beginners. Help users generate
project ideas, create development roadmaps, recommend tech stacks,
and plan hackathon MVPs. Generate structured response with Project
Overview, Frontend, Backend, Database, APIs, Development Phases,
Deployment, Future scope. Use markdown. Keep under 400 words.""",
  "hackathon": """You are Projectra AI in HACKATHON MODE. User has
12-48 hours to build an MVP. Suggest fastest tech stack. List only
core MVP features max 3-5. List what to SKIP. Give time breakdown.
Under 300 words.""",
  "beginner": """You are Projectra AI in BEGINNER MODE. Use simple
friendly language. Break into numbered steps. Suggest beginner-friendly
tools only. Include How to start today section. Under 400 words.""",
  "stack": """You are Projectra AI in TECH STACK ADVISOR mode.
Recommend Frontend, Backend, Database, Deployment with pros and cons.
Give clear final recommendation. Use comparison tables. Under 400 words.""",
  "critique": """You are Projectra AI in JUDGE MODE: a brutally honest
hackathon judge reviewing a project that Projectra itself just
generated. Score on Novelty, Completeness, Wow-factor, Story — each
out of 10, then an overall score. Be candid; do not flatter. After
scores, give exactly three concrete, actionable improvements the team
could ship in the next 24 hours. Use markdown headings and bullets.
Under 350 words."""
}


def sse(payload):
    return f"data: {json.dumps(payload)}\n\n"


@app.route("/api/health")
def health():
    return {"status": "ok", "keys": len(POOL)}


@app.route("/api/ping")
def ping():
    return {"status": "alive"}


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    user_message = data.get("message", "")
    mode = data.get("mode", "normal")
    system_prompt = SYSTEM_PROMPTS.get(mode, SYSTEM_PROMPTS["normal"])
    full_prompt = f"{system_prompt}\n\nUser: {user_message}"

    def generate():
        # Force the proxy (Render/Cloudflare/nginx) to flush headers and
        # start streaming immediately, so short responses don't sit
        # buffered until the whole response is generated.
        yield ": " + ("=" * 2048) + "\n\n"

        if len(POOL) == 0:
            yield sse({"error": "No Gemini API keys configured.", "done": True})
            return

        for _ in range(len(POOL)):
            key = POOL.acquire()
            if not key:
                yield sse({"error": "All API keys are rate-limited. Please try again shortly.", "done": True})
                return

            try:
                client = genai.Client(api_key=key)
                started = False
                stream = client.models.generate_content_stream(
                    model="gemini-2.5-flash",
                    contents=full_prompt,
                )
                for chunk in stream:
                    if chunk.text:
                        started = True
                        yield sse({"chunk": chunk.text})
                yield sse({"done": True})
                return

            except genai.errors.ClientError as e:
                if started:
                    yield sse({"error": "Stream interrupted.", "done": True})
                    return
                msg = str(e)
                if e.code == 429:
                    POOL.mark_failed(key, "quota")
                    continue
                if e.code == 400 and "API_KEY_INVALID" in msg:
                    POOL.mark_failed(key, "invalid")
                    continue
                yield sse({"error": msg, "done": True})
                return
            except Exception as e:
                if started:
                    yield sse({"error": "Stream interrupted.", "done": True})
                    return
                yield sse({"error": str(e), "done": True})
                return

        yield sse({"error": "All API keys are rate-limited. Please try again shortly.", "done": True})

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@app.route("/api/agent/build", methods=["POST"])
def agent_build():
    from agent import build_architect_event_stream

    data = request.get_json() or {}
    idea = data.get("idea", "")
    stack_hint = data.get("stack", "auto")

    if not idea.strip():
        def empty():
            yield sse({"type": "error", "error": "Provide a project idea.", "done": True})
        return Response(stream_with_context(empty()), mimetype="text/event-stream")

    return Response(
        stream_with_context(build_architect_event_stream(POOL, sse, idea, stack_hint)),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@app.route("/api/project/<project_id>/zip")
def project_zip(project_id):
    import shutil
    from flask import send_file, abort
    from agent import PROJECT_STORE, _gc_project_store

    _gc_project_store()
    meta = PROJECT_STORE.get(project_id)
    if not meta:
        abort(404, description="Project not found or expired.")

    src_dir = meta["dir"]
    archive_base = str(src_dir) + "_archive"
    archive_path = shutil.make_archive(archive_base, "zip", root_dir=str(src_dir))
    return send_file(
        archive_path,
        mimetype="application/zip",
        as_attachment=True,
        download_name=f"projectra_{project_id[:8]}.zip",
    )


if __name__ == "__main__":
    app.run(debug=True, port=5000, threaded=True)
