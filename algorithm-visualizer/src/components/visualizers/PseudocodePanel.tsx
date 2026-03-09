interface PseudocodePanelProps {
  title: string;
  lines: string[];
  activeLine: number | null;
}

export default function PseudocodePanel({
  title,
  lines,
  activeLine,
}: PseudocodePanelProps) {
  return (
    <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>

      <div className="mt-4 space-y-2 font-mono text-sm">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isActive = activeLine === lineNumber;

          return (
            <div
              key={lineNumber}
              className={`flex gap-4 rounded-lg px-3 py-2 transition ${
                isActive
                  ? "bg-cyan-500/15 ring-1 ring-cyan-400"
                  : "bg-transparent"
              }`}
            >
              <span
                className={`w-6 shrink-0 text-right ${
                  isActive ? "text-cyan-300" : "text-slate-500"
                }`}
              >
                {lineNumber}
              </span>

              <span className={isActive ? "text-white" : "text-slate-300"}>
                {line}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}