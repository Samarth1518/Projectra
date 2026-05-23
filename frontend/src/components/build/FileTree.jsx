import { motion } from "framer-motion";
import { File, FileCode, FileText, FileJson, Loader2, Check, AlertCircle } from "lucide-react";

const ICON_BY_LANG = {
  json: FileJson,
  md: FileText,
  txt: FileText,
  html: FileCode,
  css: FileCode,
  js: FileCode,
  jsx: FileCode,
  ts: FileCode,
  tsx: FileCode,
  py: FileCode,
};

function statusIcon(status) {
  if (status === "streaming") return <Loader2 size={12} className="text-neon-blue animate-spin" />;
  if (status === "done")      return <Check size={12} className="text-emerald-400" />;
  if (status === "error")     return <AlertCircle size={12} className="text-red-400" />;
  return <span className="w-2 h-2 rounded-full bg-white/20" />;
}

export default function FileTree({ files, activeFile, onSelect }) {
  const entries = Object.entries(files || {});
  if (entries.length === 0) {
    return (
      <div className="text-xs text-text-muted italic px-2 py-4">
        Files will materialise here as the architect plans…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 text-sm">
      {entries.map(([path, meta], i) => {
        const Icon = ICON_BY_LANG[meta.language] || File;
        const isActive = path === activeFile;
        return (
          <motion.button
            key={path}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02 }}
            onClick={() => onSelect?.(path)}
            title={meta.status === "error" ? `Error: ${meta.error || "generation failed"}` : meta.purpose}
            className={`
              flex items-center gap-2 px-2 py-1.5 rounded-md text-left
              transition-colors duration-150
              ${isActive ? "bg-white/[0.07] text-text-primary" : "text-text-secondary hover:bg-white/[0.04]"}
              ${meta.status === "error" ? "ring-1 ring-red-400/40" : ""}
            `}
          >
            <Icon size={13} className={isActive ? "text-neon-blue" : "text-text-muted"} />
            <span className="flex-1 truncate font-mono text-xs">{path}</span>
            {statusIcon(meta.status)}
          </motion.button>
        );
      })}
    </div>
  );
}
