import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons";
import { useTheme } from "./theme/ThemeProvider";
import { formatTimestamp } from "../utils/formatResponse";
import { cn } from "../lib/utils";

function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();
  const style = resolvedTheme === "dark" ? oneDark : oneLight;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="relative group my-3 rounded-lg overflow-hidden border border-border bg-muted/40">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/40">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-colors border",
            copied
              ? "bg-primary/15 border-primary/40 text-primary"
              : "bg-background border-border text-muted-foreground hover:text-foreground"
          )}
        >
          {copied ? <CheckIcon className="h-2.5 w-2.5" /> : <CopyIcon className="h-2.5 w-2.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <SyntaxHighlighter
        style={style}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
          fontSize: "0.78rem",
          lineHeight: "1.6",
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

export default function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = message.content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="flex justify-end"
      >
        <div className="max-w-[78%] flex flex-col items-end gap-1">
          <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed bg-primary text-primary-foreground shadow-sm">
            {message.content}
          </div>
          <span className="text-[10px] text-muted-foreground pr-1">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-3"
    >
      <div className="shrink-0 h-8 w-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
        P
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div
          className={cn(
            "px-4 py-3 rounded-2xl rounded-tl-sm border bg-card text-card-foreground",
            "shadow-[inset_0_1px_0_hsl(var(--border)/0.4)]",
            message.isError
              ? "border-destructive/40 bg-destructive/5"
              : "border-border"
          )}
        >
          <div className="text-sm leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const language = match ? match[1] : "";
                  const value = String(children).replace(/\n$/, "");
                  if (!inline && (match || value.includes("\n"))) {
                    return <CodeBlock language={language} value={value} />;
                  }
                  return (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-[0.85em] font-mono text-foreground" {...props}>
                      {children}
                    </code>
                  );
                },
                h1: ({ children }) => <h1 className="text-base font-semibold mt-3 mb-1.5 text-foreground">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-semibold mt-2.5 mb-1 text-foreground">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold mt-2 mb-1 text-foreground/90">{children}</h3>,
                p: ({ children }) => <p className="mb-2 leading-relaxed text-foreground/90">{children}</p>,
                ul: ({ children }) => <ul className="mb-2 pl-5 list-disc space-y-1 marker:text-muted-foreground">{children}</ul>,
                ol: ({ children }) => <ol className="mb-2 pl-5 list-decimal space-y-1 marker:text-muted-foreground">{children}</ol>,
                li: ({ children }) => <li className="text-sm text-foreground/90">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                em: ({ children }) => <em className="text-primary not-italic font-medium">{children}</em>,
                blockquote: ({ children }) => (
                  <blockquote className="pl-3 my-2 border-l-2 border-primary/60 italic text-sm text-muted-foreground">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3 rounded-md border border-border">
                    <table className="w-full text-sm border-collapse">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40 border-b border-border">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-3 py-2 text-xs text-foreground/90 border-b border-border/60">
                    {children}
                  </td>
                ),
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-2 hover:opacity-80">
                    {children}
                  </a>
                ),
                hr: () => <hr className="my-3 border-t border-border" />,
              }}
            >
              {message.content}
            </ReactMarkdown>

            {message.isStreaming && (
              <span
                className="inline-block w-[2px] h-[1em] ml-1 align-middle bg-foreground"
                style={{ animation: "blink 1s step-end infinite" }}
              />
            )}
          </div>

          {!message.isError && message.content && !message.isStreaming && (
            <div className="flex justify-end mt-3">
              <button
                onClick={handleCopy}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-colors border",
                  copied
                    ? "bg-primary/15 border-primary/40 text-primary"
                    : "bg-background border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {copied ? <CheckIcon className="h-2.5 w-2.5" /> : <CopyIcon className="h-2.5 w-2.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground pl-1">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}
