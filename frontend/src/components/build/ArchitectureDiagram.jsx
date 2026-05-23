import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import { useTheme } from "../theme/ThemeProvider";

export default function ArchitectureDiagram({ code }) {
  const ref = useRef(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!code || !ref.current) return;
    let cancelled = false;

    mermaid.initialize({
      startOnLoad: false,
      theme: resolvedTheme === "dark" ? "dark" : "neutral",
      themeVariables:
        resolvedTheme === "dark"
          ? {
              background: "transparent",
              primaryColor: "hsl(258 33% 18%)",
              primaryTextColor: "hsl(220 5% 96%)",
              primaryBorderColor: "hsl(82 86% 64%)",
              lineColor: "hsl(220 10% 60%)",
              fontFamily: "Inter, system-ui, sans-serif",
            }
          : {
              background: "transparent",
              primaryColor: "hsl(60 27% 95%)",
              primaryTextColor: "hsl(258 33% 14%)",
              primaryBorderColor: "hsl(82 86% 64%)",
              lineColor: "hsl(220 12% 45%)",
              fontFamily: "Inter, system-ui, sans-serif",
            },
      securityLevel: "loose",
    });

    (async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, code);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch (err) {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = `<pre style="color:hsl(var(--destructive));font-size:11px;white-space:pre-wrap;margin:0">${String(err.message || err)}</pre>`;
        }
      }
    })();
    return () => { cancelled = true; };
  }, [code, resolvedTheme]);

  if (!code) {
    return (
      <div className="text-xs text-muted-foreground italic px-2 py-4">
        Architecture diagram will appear here.
      </div>
    );
  }

  return <div ref={ref} className="w-full overflow-auto" />;
}
