import { useState, useEffect, useRef } from "react";
import { SunIcon, MoonIcon, DesktopIcon } from "@radix-ui/react-icons";
import { useTheme } from "./ThemeProvider";
import { cn } from "../../lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: DesktopIcon },
];

export function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = OPTIONS.find((o) => o.value === theme) || OPTIONS[2];
  const CurrentIcon = current.icon;

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Theme"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <CurrentIcon className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-md border border-border bg-popover text-popover-foreground shadow-md p-1 z-50">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = opt.value === theme;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { setTheme(opt.value); setOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors",
                  active ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
