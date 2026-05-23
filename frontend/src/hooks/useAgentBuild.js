import { useCallback, useRef, useState } from "react";

const BASE = import.meta.env.VITE_API_URL || "";

const initialState = {
  status: "idle", // idle | architecting | coding | done | error
  stage: 0,       // 0 idle, 1 plan ready, 2 coding, 3 done
  summary: "",
  stack: null,
  runInstructions: "",
  mermaid: "",
  manifest: [],
  files: {},      // path -> { code, status: 'pending'|'streaming'|'done'|'error', language }
  activeFile: null,
  projectId: null,
  error: null,
};

export function useAgentBuild() {
  const [state, setState] = useState(initialState);
  const abortRef = useRef(null);

  const reset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setState(initialState);
  }, []);

  const cancel = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setState(s => ({ ...s, status: s.status === "done" ? s.status : "idle" }));
  }, []);

  const build = useCallback(async (idea, stack) => {
    if (!idea?.trim()) return;
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({ ...initialState, status: "architecting", stage: 0 });

    try {
      const res = await fetch(`${BASE}/api/agent/build`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, stack: stack || "auto" }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        setState(s => ({ ...s, status: "error", error: `Backend returned ${res.status}` }));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        let idx;
        while ((idx = buf.indexOf("\n\n")) !== -1) {
          const frame = buf.slice(0, idx);
          buf = buf.slice(idx + 2);
          if (!frame.startsWith("data:")) continue;

          let evt;
          try { evt = JSON.parse(frame.slice(5).trim()); } catch { continue; }
          dispatch(evt, setState);
          if (evt.type === "error" || evt.type === "done") {
            try { await reader.cancel(); } catch {}
          }
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setState(s => ({ ...s, status: "error", error: err.message || String(err) }));
      }
    } finally {
      abortRef.current = null;
    }
  }, []);

  const setActiveFile = useCallback((path) => {
    setState(s => ({ ...s, activeFile: path }));
  }, []);

  return { ...state, build, cancel, reset, setActiveFile };
}

function dispatch(evt, setState) {
  switch (evt.type) {
    case "plan":
      setState(s => ({
        ...s,
        status: "architecting",
        stage: 1,
        summary: evt.summary || "",
        stack: evt.stack || null,
        runInstructions: evt.run_instructions || "",
        projectId: evt.project_id || s.projectId,
      }));
      break;

    case "diagram":
      setState(s => ({ ...s, mermaid: evt.mermaid || "" }));
      break;

    case "manifest":
      setState(s => {
        const files = {};
        (evt.files || []).forEach(f => {
          files[f.path] = { code: "", status: "pending", language: f.language, purpose: f.purpose };
        });
        return { ...s, manifest: evt.files || [], files, activeFile: evt.files?.[0]?.path || null };
      });
      break;

    case "architect_done":
      setState(s => ({ ...s, status: "coding", stage: 2 }));
      break;

    case "file_start":
      setState(s => ({
        ...s,
        activeFile: evt.path,
        files: { ...s.files, [evt.path]: { ...(s.files[evt.path] || {}), code: "", status: "streaming" } },
      }));
      break;

    case "file_chunk":
      setState(s => {
        const prev = s.files[evt.path] || { code: "", status: "streaming" };
        return {
          ...s,
          files: { ...s.files, [evt.path]: { ...prev, code: prev.code + (evt.code || "") } },
        };
      });
      break;

    case "file_end":
      setState(s => {
        const prev = s.files[evt.path];
        if (!prev) return s;
        return { ...s, files: { ...s.files, [evt.path]: { ...prev, status: "done" } } };
      });
      break;

    case "file_error":
      setState(s => {
        const prev = s.files[evt.path] || {};
        return { ...s, files: { ...s.files, [evt.path]: { ...prev, status: "error" } } };
      });
      break;

    case "done":
      setState(s => ({ ...s, status: "done", stage: 3, projectId: evt.project_id || s.projectId }));
      break;

    case "error":
      setState(s => ({ ...s, status: "error", error: evt.error || "Unknown error" }));
      break;

    default:
      break;
  }
}
