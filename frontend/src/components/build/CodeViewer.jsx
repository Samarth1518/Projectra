import { useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const LANG_MAP = {
  jsx: "jsx",
  tsx: "tsx",
  js: "javascript",
  ts: "typescript",
  py: "python",
  html: "markup",
  css: "css",
  json: "json",
  md: "markdown",
  yml: "yaml",
  yaml: "yaml",
  sh: "bash",
};

export default function CodeViewer({ path, code, language, status }) {
  const ref = useRef(null);

  // Auto-scroll to bottom while streaming.
  useEffect(() => {
    if (status === "streaming" && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [code, status]);

  if (!path) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted text-sm italic">
        Select a file to preview its source.
      </div>
    );
  }

  if (!code) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted text-sm italic">
        {status === "pending" ? "Waiting in queue…" : "Streaming…"}
      </div>
    );
  }

  const prismLang = LANG_MAP[language] || "text";

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 border-b border-white/[0.06] text-xs font-mono text-text-secondary flex items-center justify-between flex-shrink-0">
        <span>{path}</span>
        <span className="text-text-muted">
          {status === "streaming" ? "streaming…" : status === "done" ? "complete" : status}
        </span>
      </div>
      <div ref={ref} className="flex-1 overflow-auto">
        <SyntaxHighlighter
          language={prismLang}
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: "16px",
            background: "transparent",
            fontSize: "12px",
            lineHeight: "1.55",
          }}
          showLineNumbers
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
