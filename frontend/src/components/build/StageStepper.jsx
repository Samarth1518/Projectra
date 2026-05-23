import { CheckIcon, UpdateIcon } from "@radix-ui/react-icons";
import { cn } from "../../lib/utils";

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
              className={cn(
                "h-5 w-5 rounded-full border flex items-center justify-center text-[10px] font-mono",
                done && "bg-primary/15 border-primary text-primary",
                active && "bg-accent border-primary text-foreground",
                !done && !active && "border-border text-muted-foreground"
              )}
            >
              {done ? <CheckIcon className="h-3 w-3" /> : active ? <UpdateIcon className="h-3 w-3 animate-spin" /> : s.id}
            </div>
            <span className={cn(done || active ? "text-foreground" : "text-muted-foreground")}>{s.label}</span>
            {i < STAGES.length - 1 && <span className="w-4 h-px bg-border" />}
          </div>
        );
      })}
    </div>
  );
}
