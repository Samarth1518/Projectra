import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { formatTimestamp } from '../utils/formatResponse'

const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group my-3 rounded-lg overflow-hidden border border-white/10">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-xs text-gray-400 font-mono">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200 border
            ${copied
              ? 'bg-green-500/20 border-green-500/50 text-green-400'
              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={atomDark}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
          fontSize: "0.8rem",
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export default function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = message.content;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error("Copy failed:", e);
      }
    }
  };

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex justify-end mb-4"
      >
        <div className="max-w-[75%] flex flex-col items-end gap-1">
          <div
            className="px-4 py-3 rounded-2xl rounded-tr-md text-sm leading-relaxed"
            style={{
              background: 'linear-gradient(135deg, #4f9eff, #6b8fff)',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(79,158,255,0.25)',
            }}
          >
            {message.content}
          </div>
          <span className="text-xs pr-1" style={{ color: 'var(--text-muted)' }}>
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex items-start gap-3 mb-4 group relative"
    >
      {/* AI Avatar */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
        style={{ background: 'linear-gradient(135deg, #4f9eff, #a78bfa)', boxShadow: '0 0 12px rgba(79,158,255,0.3)' }}
      >
        P
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1 relative">
        <div
          className="px-4 py-3.5 rounded-2xl rounded-tl-md relative"
          style={{
            background: message.isError ? 'rgba(239,68,68,0.06)' : 'rgba(18,18,28,0.9)',
            border: message.isError ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(255,255,255,0.07)',
          }}
        >


          <div className="prose-dark text-sm relative">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const language = match ? match[1] : "";
                  const value = String(children).replace(/\n$/, "");
                  
                  if (!inline && (match || value.includes("\n"))) {
                    return <CodeBlock language={language} value={value} />;
                  }
                  return (
                    <code
                      className="bg-white/10 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-3 gradient-text">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-bold mb-1.5 mt-2.5" style={{ color: '#e0dfff' }}>{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 mt-2" style={{ color: '#c8c7f0' }}>{children}</h3>,
                p: ({ children }) => <p className="mb-2 leading-relaxed inline" style={{ color: '#d4d3f0' }}>{children}</p>,
                ul: ({ children }) => <ul className="mb-2 space-y-0.5 pl-4">{children}</ul>,
                ol: ({ children }) => <ol className="mb-2 space-y-0.5 pl-4 list-decimal">{children}</ol>,
                li: ({ children }) => <li className="text-sm" style={{ color: '#d4d3f0' }}>{children}</li>,
                strong: ({ children }) => <strong className="font-semibold" style={{ color: '#f1f0ff' }}>{children}</strong>,
                em: ({ children }) => <em style={{ color: '#a78bfa' }}>{children}</em>,
                blockquote: ({ children }) => (
                  <blockquote className="pl-3 my-2 italic text-sm" style={{ borderLeft: '3px solid #4f9eff', color: 'var(--text-secondary)' }}>
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3">
                    <table className="w-full text-sm border-collapse">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="text-left px-3 py-2 text-xs font-semibold"
                    style={{ background: 'rgba(79,158,255,0.1)', border: '1px solid rgba(255,255,255,0.06)', color: '#4f9eff' }}>
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-3 py-2 text-xs" style={{ border: '1px solid rgba(255,255,255,0.05)', color: '#d4d3f0' }}>
                    {children}
                  </td>
                ),
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-2" style={{ color: '#4f9eff' }}>
                    {children}
                  </a>
                ),
                hr: () => <hr className="my-3" style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)' }} />,
              }}
            >
              {message.content}
            </ReactMarkdown>

            {message.isStreaming && (
              <span 
                className="inline-block w-[2px] h-[1em] ml-1 align-middle"
                style={{ 
                  background: '#4f9eff',
                  boxShadow: '0 0 8px #4f9eff',
                  animation: 'blink 1s step-end infinite' 
                }}
              />
            )}
          </div>
          
          {!message.isError && (
            <div className="flex justify-end mt-3">
              <button
                onClick={handleCopy}
                className={`
                  flex items-center gap-1 px-2 py-1 rounded-md text-xs
                  transition-all duration-200 border
                  ${copied 
                    ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {copied ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" 
                         fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" 
                         fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        <span className="text-xs pl-1" style={{ color: 'var(--text-muted)' }}>
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}} />
    </motion.div>
  )
}
