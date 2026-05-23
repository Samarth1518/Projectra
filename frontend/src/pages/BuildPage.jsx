import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Play, Square } from "lucide-react";
import { useAgentBuild } from "../hooks/useAgentBuild";
import FileTree from "../components/build/FileTree";
import CodeViewer from "../components/build/CodeViewer";
import ArchitectureDiagram from "../components/build/ArchitectureDiagram";
import StageStepper from "../components/build/StageStepper";
import ResultsBar from "../components/build/ResultsBar";

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
    <div className="h-screen flex flex-col bg-[#0a0a12] text-text-primary">
      {/* Top bar */}
      <header className="border-b border-white/[0.06] bg-[#0d0d14]">
        <div className="flex items-center gap-3 px-5 py-3">
          <Link to="/chat" className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft size={14} />
            Chat
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-neon-purple" />
            <span className="font-semibold text-sm gradient-text">Build Mode</span>
          </div>
          <div className="ml-auto">
            <StageStepper stage={stage} />
          </div>
        </div>

        <form onSubmit={submit} className="flex items-center gap-2 px-5 pb-4">
          <input
            type="text"
            placeholder="Describe your project — 'a habit tracker with React and a Flask backend'"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            disabled={isBusy}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-neon-blue/50 outline-none text-sm placeholder:text-text-muted transition-colors disabled:opacity-60"
          />
          <select
            value={stack}
            onChange={(e) => setStack(e.target.value)}
            disabled={isBusy}
            className="px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm outline-none focus:border-neon-blue/50 disabled:opacity-60"
          >
            {STACK_OPTIONS.map(s => <option key={s.value} value={s.value} className="bg-[#0d0d14]">{s.label}</option>)}
          </select>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{
              background: isBusy
                ? "linear-gradient(135deg, #f87171, #ef4444)"
                : "linear-gradient(135deg, #4f9eff, #a78bfa)",
              boxShadow: "0 0 20px rgba(79,158,255,0.25)",
            }}
          >
            {isBusy ? <><Square size={14} /> Stop</> : <><Play size={14} /> Build</>}
          </motion.button>
        </form>
      </header>

      {/* Body — three panes */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[320px_240px_1fr] overflow-hidden">
        {/* Plan + diagram */}
        <aside className="border-r border-white/[0.06] overflow-y-auto p-4 space-y-4">
          <Section title="Plan">
            {summary
              ? <p className="text-xs leading-relaxed text-text-secondary">{summary}</p>
              : <Idle text="The architect will summarise the project here." />}
          </Section>
          <Section title="Architecture">
            <ArchitectureDiagram code={mermaid} />
          </Section>
        </aside>

        {/* File tree */}
        <aside className="border-r border-white/[0.06] overflow-y-auto p-3">
          <p className="text-[10px] uppercase tracking-widest text-text-muted px-2 pb-2 font-semibold">
            Files {manifest.length ? `(${manifest.length})` : ""}
          </p>
          <FileTree files={files} activeFile={activeFile} onSelect={setActiveFile} />
        </aside>

        {/* Code viewer */}
        <main className="overflow-hidden">
          <CodeViewer
            path={activeFile}
            code={active?.code}
            language={active?.language}
            status={active?.status}
          />
        </main>
      </div>

      {/* Footer actions */}
      <footer className="border-t border-white/[0.06] bg-[#0d0d14] px-5 py-3 flex items-center justify-between">
        <div className="text-xs text-text-muted">
          {error
            ? <span className="text-red-400">⚠ {error}</span>
            : status === "done" ? <span className="text-emerald-400">✓ Ready</span>
            : status === "coding" ? <span className="text-neon-blue">Writing code…</span>
            : status === "architecting" ? <span className="text-neon-purple">Architecting…</span>
            : <span>Type an idea above and hit Build.</span>}
        </div>
        <ResultsBar
          status={status}
          projectId={projectId}
          files={files}
          stack={null /* not yet wired through; using detect-from-files heuristic */}
          onCritique={() => {/* TODO: hook to chat critique mode */}}
        />
      </footer>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-text-muted pb-2 font-semibold">{title}</p>
      {children}
    </div>
  );
}

function Idle({ text }) {
  return <p className="text-xs italic text-text-muted">{text}</p>;
}
