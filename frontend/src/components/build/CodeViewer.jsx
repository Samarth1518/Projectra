import { useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../theme/ThemeProvider";

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
  const { resolvedTheme } = useTheme();
  const style = resolvedTheme === "dark" ? oneDark : oneLight;

  useEffect(() => {
    if (status === "streaming" && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [code, status]);

  if (!path) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
        Select a file to preview its source.
      </div>
    );
  }

  if (!code) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
        {status === "pending" ? "Waiting in queue" : "Streaming"}
      </div>
    );
  }

  const prismLang = LANG_MAP[language] || "text";

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 border-b border-border text-xs font-mono text-muted-foreground flex items-center justify-between flex-shrink-0">
        <span>{path}</span>
        <span>
          {status === "streaming" ? "streaming" : status === "done" ? "complete" : status}
        </span>
      </div>
      <div ref={ref} className="flex-1 overflow-auto">
        <SyntaxHighlighter
          language={prismLang}
          style={style}
          customStyle={{
            margin: 0,
            padding: "16px",
            background: "transparent",
            fontSize: "12px",
            lineHeight: "1.6",
          }}
          showLineNumbers
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
