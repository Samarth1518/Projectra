import { Check, Loader2 } from "lucide-react";

const STAGES = [
  { id: 1, label: "Architect" },
  { id: 2, label: "Coding" },
  { id: 3, label: "Ready" },
];

export default function StageStepper({ stage }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {STAGES.map((s, i) => {
        const done = stage > s.id;
        const active = stage === s.id;
        return (
          <div key={s.id} className="flex items-center gap-2">
            <div
              className={`
                w-5 h-5 rounded-full border flex items-center justify-center
                ${done ? "bg-emerald-400/20 border-emerald-400 text-emerald-400" : ""}
                ${active ? "bg-neon-blue/20 border-neon-blue text-neon-blue" : ""}
                ${!done && !active ? "border-white/10 text-text-muted" : ""}
              `}
            >
              {done ? <Check size={11} /> : active ? <Loader2 size={11} className="animate-spin" /> : <span>{s.id}</span>}
            </div>
            <span className={done || active ? "text-text-primary" : "text-text-muted"}>{s.label}</span>
            {i < STAGES.length - 1 && <span className="w-4 h-px bg-white/10" />}
          </div>
        );
      })}
    </div>
  );
}
