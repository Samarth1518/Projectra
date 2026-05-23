import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MagicWandIcon,
  ArrowLeftIcon,
  PlayIcon,
  StopIcon,
  HomeIcon,
} from "@radix-ui/react-icons";
import { useAgentBuild } from "../hooks/useAgentBuild";
import FileTree from "../components/build/FileTree";
import CodeViewer from "../components/build/CodeViewer";
import ArchitectureDiagram from "../components/build/ArchitectureDiagram";
import StageStepper from "../components/build/StageStepper";
import ResultsBar from "../components/build/ResultsBar";
import CritiqueDrawer from "../components/build/CritiqueDrawer";
import VoiceInputButton from "../components/build/VoiceInputButton";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { ThemeToggle } from "../components/theme/ThemeToggle";
import { cn } from "../lib/utils";

const STACK_OPTIONS = [
  { value: "auto", label: "Auto (let AI choose)" },
  { value: "React + Vite", label: "React + Vite (single-page)" },
  { value: "Plain HTML/CSS/JS", label: "Plain HTML / CSS / JS" },
  { value: "React + Vite + Tailwind", label: "React + Vite + Tailwind" },
  { value: "Next.js", label: "Next.js" },
  { value: "Node.js + Express", label: "Node + Express API" },
];

export default function BuildPage() {
  const [idea, setIdea] = useState("");
  const [stack, setStack] = useState("auto");
  const [critiqueOpen, setCritiqueOpen] = useState(false);
  const {
    status, stage, summary, mermaid, files, manifest, activeFile,
    projectId, error, build, cancel, setActiveFile,
  } = useAgentBuild();

  const isBusy = status === "architecting" || status === "coding";
  const active = activeFile ? files[activeFile] : null;

  const submit = (e) => {
    e?.preventDefault();
    if (isBusy) { cancel(); return; }
    build(idea, stack);
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-3 px-5 py-3">
          <Link to="/chat" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Chat
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <MagicWandIcon className="h-3.5 w-3.5 text-primary" />
            <span className="font-semibold text-sm">Build Mode</span>
            <Badge variant="muted" className="text-[10px] hidden md:inline-flex">Agentic</Badge>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <StageStepper stage={stage} />
            <div className="h-5 w-px bg-border hidden md:block" />
            <ThemeToggle />
            <Link to="/" className="hidden md:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent">
              <HomeIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <form onSubmit={submit} className="flex flex-wrap items-center gap-2 px-5 pb-3">
          <Input
            type="text"
            placeholder="Describe your project. For example: a habit tracker with React and a Flask backend"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            disabled={isBusy}
            className="flex-1 min-w-[260px] rounded-xl h-11"
          />
          <VoiceInputButton onTranscript={setIdea} disabled={isBusy} />
          <select
            value={stack}
            onChange={(e) => setStack(e.target.value)}
            disabled={isBusy}
            className={cn(
              "h-11 rounded-xl px-3 text-sm bg-card border border-input text-foreground",
              "shadow-[inset_0_1px_0_hsl(var(--border)/0.5)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:opacity-50"
            )}
          >
            {STACK_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <Button
            type="submit"
            size="lg"
            variant={isBusy ? "destructive" : "default"}
            className="h-11 rounded-xl"
          >
            {isBusy ? <><StopIcon className="h-4 w-4" /> Stop</> : <><PlayIcon className="h-4 w-4" /> Build</>}
          </Button>
        </form>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[320px_240px_1fr] overflow-hidden">
        <aside className="border-r border-border overflow-y-auto p-4 space-y-5 bg-sidebar/60">
          <Section title="Plan">
            {summary ? (
              <p className="text-xs leading-relaxed text-foreground/85">{summary}</p>
            ) : (
              <Idle text="The architect will summarise the project here." />
            )}
          </Section>
          <Section title="Architecture">
            <ArchitectureDiagram code={mermaid} />
          </Section>
        </aside>

        <aside className="border-r border-border overflow-y-auto p-3">
          <div className="flex items-center justify-between px-2 pb-2">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Files</p>
            {manifest.length > 0 && (
              <Badge variant="muted" className="text-[10px]">{manifest.length}</Badge>
            )}
          </div>
          <FileTree files={files} activeFile={activeFile} onSelect={setActiveFile} />
        </aside>

        <main className="overflow-hidden bg-card">
          <CodeViewer
            path={activeFile}
            code={active?.code}
            language={active?.language}
            status={active?.status}
          />
        </main>
      </div>

      <footer className="border-t border-border bg-background px-5 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <StatusBadge status={status} error={error} />
        <ResultsBar
          status={status}
          projectId={projectId}
          files={files}
          stack={null}
          onCritique={() => setCritiqueOpen(true)}
        />
      </footer>

      <CritiqueDrawer
        open={critiqueOpen}
        onClose={() => setCritiqueOpen(false)}
        summary={summary}
        stack={null}
        manifest={manifest}
      />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground pb-2 font-semibold">{title}</p>
      {children}
    </div>
  );
}

function Idle({ text }) {
  return <p className="text-xs italic text-muted-foreground">{text}</p>;
}

function StatusBadge({ status, error }) {
  if (error) {
    return <span className="text-xs text-destructive">{error}</span>;
  }
  if (status === "done") {
    return (
      <motion.span
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="text-xs text-primary font-medium"
      >
        Ready
      </motion.span>
    );
  }
  if (status === "coding") return <span className="text-xs text-foreground">Writing code</span>;
  if (status === "architecting") return <span className="text-xs text-foreground">Architecting</span>;
  return <span className="text-xs text-muted-foreground">Type an idea above and hit Build.</span>;
}
