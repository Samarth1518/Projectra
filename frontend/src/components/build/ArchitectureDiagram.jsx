import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    background: "#0d0d14",
    primaryColor: "#1a1a2e",
    primaryTextColor: "#e6e6f0",
    primaryBorderColor: "#4f9eff",
    lineColor: "#a78bfa",
    fontFamily: "Inter, sans-serif",
  },
  securityLevel: "loose",
});

export default function ArchitectureDiagram({ code }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!code || !ref.current) return;
    let cancelled = false;
    (async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, code);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch (err) {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = `<pre style="color:#f87171;font-size:11px;white-space:pre-wrap">${String(err.message || err)}</pre>`;
        }
      }
    })();
    return () => { cancelled = true; };
  }, [code]);

  if (!code) {
    return (
      <div className="text-xs text-text-muted italic px-2 py-4">
        Architecture diagram will appear here…
      </div>
    );
  }

  return <div ref={ref} className="w-full overflow-auto" />;
}
