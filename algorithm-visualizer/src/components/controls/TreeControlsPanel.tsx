interface TreeControlsPanelProps {
  speed: number;
  onSpeedChange: (value: number) => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onResetTraversal: () => void;
  onResetTree: () => void;
}

export default function TreeControlsPanel({
  speed,
  onSpeedChange,
  onStart,
  onPause,
  onResume,
  onResetTraversal,
  onResetTree,
}: TreeControlsPanelProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onStart}
          className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
        >
          Start
        </button>

        <button
          type="button"
          onClick={onPause}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200"
        >
          Pause
        </button>

        <button
          type="button"
          onClick={onResume}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200"
        >
          Resume
        </button>

        <button
          type="button"
          onClick={onResetTraversal}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200"
        >
          Reset Traversal
        </button>

        <button
          type="button"
          onClick={onResetTree}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500"
        >
          Reset Tree
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm text-slate-300">Speed</span>

        <input
          type="range"
          min="10"
          max="1000"
          step="10"
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          className="w-48"
        />

        <span className="text-xs text-slate-400">{speed} ms</span>
      </div>
    </div>
  );
}