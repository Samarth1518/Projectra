import { motion } from "framer-motion";
import {
  FileIcon,
  FileTextIcon,
  CodeIcon,
  UpdateIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { cn } from "../../lib/utils";

const ICON_BY_LANG = {
  json: FileTextIcon,
  md: FileTextIcon,
  txt: FileTextIcon,
  html: CodeIcon,
  css: CodeIcon,
  js: CodeIcon,
  jsx: CodeIcon,
  ts: CodeIcon,
  tsx: CodeIcon,
  py: CodeIcon,
};

function statusIcon(status) {
  if (status === "streaming") return <UpdateIcon className="h-3 w-3 text-primary animate-spin" />;
  if (status === "done")      return <CheckIcon className="h-3 w-3 text-primary" />;
  if (status === "error")     return <ExclamationTriangleIcon className="h-3 w-3 text-destructive" />;
  return <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 inline-block" />;
}

export default function FileTree({ files, activeFile, onSelect }) {
  const entries = Object.entries(files || {});
  if (entries.length === 0) {
    return (
      <div className="text-xs text-muted-foreground italic px-2 py-4">
        Files will appear here as the architect plans.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 text-sm">
      {entries.map(([path, meta], i) => {
        const Icon = ICON_BY_LANG[meta.language] || FileIcon;
        const isActive = path === activeFile;
        return (
          <motion.button
            key={path}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02, duration: 0.2 }}
            onClick={() => onSelect?.(path)}
            title={meta.status === "error" ? `Error: ${meta.error || "generation failed"}` : meta.purpose}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-foreground/80 hover:bg-accent/50",
              meta.status === "error" && "ring-1 ring-destructive/40"
            )}
          >
            <Icon className={cn("h-3 w-3", isActive ? "text-primary" : "text-muted-foreground")} />
            <span className="flex-1 truncate font-mono text-xs">{path}</span>
            {statusIcon(meta.status)}
          </motion.button>
        );
      })}
    </div>
  );
}
