import { useState } from "react";

interface ControlsPanelProps {
  speed: number;
  onSpeedChange: (value: number) => void;
  onGenerateNewArray: () => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onApplyCustomArray: (values: number[]) => void;
}

export default function ControlsPanel({
  speed,
  onSpeedChange,
  onGenerateNewArray,
  onStart,
  onPause,
  onResume,
  onReset,
  onApplyCustomArray,
}: ControlsPanelProps) {
  const [customArray, setCustomArray] = useState("");

  const handleApplyCustomArray = () => {
    const values = customArray
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => !Number.isNaN(value));

    if (values.length === 0) {
      window.alert("Please enter a valid comma-separated list of numbers.");
      return;
    }

    onApplyCustomArray(values);
  };

  const secondaryButtonClass =
    "rounded-xl border border-slate-700 bg-slate-900/60 px-5 py-3 text-sm font-medium text-slate-100 transition-all duration-200 hover:border-cyan-400 hover:bg-slate-800 active:scale-[0.98] active:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40";

  return (
    <div className="mb-6 space-y-5">
      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          onClick={onGenerateNewArray}
          className={secondaryButtonClass}
        >
          New Array
        </button>

        <button
          type="button"
          onClick={onStart}
          className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-200 hover:bg-cyan-400 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
        >
          Start
        </button>

        <button
          type="button"
          onClick={onPause}
          className={secondaryButtonClass}
        >
          Pause
        </button>

        <button
          type="button"
          onClick={onResume}
          className={secondaryButtonClass}
        >
          Resume
        </button>

        <button
          type="button"
          onClick={onReset}
          className={secondaryButtonClass}
        >
          Reset
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm font-medium text-slate-200">Speed</label>

        <input
          type="range"
          min="10"
          max="1000"
          step="10"
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          className="w-64"
        />

        <span className="text-sm text-slate-300">{speed} ms</span>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-200">
          Custom Array
        </label>

        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={customArray}
            onChange={(event) => setCustomArray(event.target.value)}
            placeholder="Example: 5, 3, 8, 1, 2"
            className="min-w-[280px] flex-1 rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />

          <button
            type="button"
            onClick={handleApplyCustomArray}
            className={secondaryButtonClass}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}