import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BASE = import.meta.env.VITE_API_URL || "";

function buildCritiquePrompt({ summary, stack, manifest }) {
  const fileList = (manifest || []).map(f => `- ${f.path} — ${f.purpose}`).join("\n");
  const stackStr = stack ? Object.entries(stack).map(([k, v]) => `${k}: ${v}`).join(", ") : "unspecified";
  return `Project summary: ${summary}\n\nStack: ${stackStr}\n\nFiles generated:\n${fileList}\n\nJudge this project now.`;
}

export default function CritiqueDrawer({ open, onClose, summary, stack, manifest }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      // Reset when closed.
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = null;
      startedRef.current = false;
      setContent("");
      setError(null);
      setLoading(false);
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    (async () => {
      try {
        const message = buildCritiquePrompt({ summary, stack, manifest });
        const res = await fetch(`${BASE}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, mode: "critique" }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          setError(`Backend returned ${res.status}`);
          setLoading(false);
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
            try {
              const evt = JSON.parse(frame.slice(5).trim());
              if (evt.chunk) setContent(c => c + evt.chunk);
              if (evt.error) setError(evt.error);
              if (evt.done) { setLoading(false); try { await reader.cancel(); } catch {} break; }
            } catch {}
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [open, summary, stack, manifest]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-[#0d0d14] border-l border-white/[0.06] flex flex-col"
          >
            <header className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-text-muted font-semibold">Judge Mode</p>
                <h2 className="text-sm font-bold gradient-text">AI Critique</h2>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-md hover:bg-white/[0.06] text-text-muted hover:text-text-primary">
                <X size={16} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-5 py-4 prose-sm">
              {loading && !content && (
                <div className="flex items-center gap-2 text-text-muted text-sm">
                  <Loader2 size={14} className="animate-spin text-neon-purple" />
                  Asking the judge…
                </div>
              )}
              {error && (
                <p className="text-red-400 text-xs">⚠ {error}</p>
              )}
              <div className="markdown-body text-sm text-text-secondary leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
