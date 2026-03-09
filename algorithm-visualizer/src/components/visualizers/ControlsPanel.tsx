import { useState } from "react";

interface ControlsPanelProps {
  speed: number;
  onSpeedChange: (value: number) => void;
  onGenerateNewArray: () => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStep: () => void;
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
  onStep,
  onReset,
  onApplyCustomArray,
}: ControlsPanelProps) {
  const [customInput, setCustomInput] = useState("");
  const [inputError, setInputError] = useState("");

  const handleApplyCustomArray = () => {
    const parsedValues = customInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map(Number);

    const hasInvalidNumber = parsedValues.some(
      (value) => Number.isNaN(value) || value < 1,
    );

    if (parsedValues.length < 3) {
      setInputError("Enter at least 3 positive numbers.");
      return;
    }

    if (parsedValues.length > 20) {
      setInputError("Use at most 20 numbers for now.");
      return;
    }

    if (hasInvalidNumber) {
      setInputError("Only positive numbers are allowed.");
      return;
    }

    setInputError("");
    onApplyCustomArray(parsedValues);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onGenerateNewArray}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500"
        >
          New Array
        </button>

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
          onClick={onStep}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200"
        >
          Step
        </button>

        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200"
        >
          Reset
        </button>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-300">Speed</span>

        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          className="w-48"
        />

        <span className="text-xs text-slate-400">{speed} ms</span>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="custom-array"
          className="block text-sm font-medium text-slate-200"
        >
          Custom Array
        </label>

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            id="custom-array"
            type="text"
            value={customInput}
            onChange={(event) => setCustomInput(event.target.value)}
            placeholder="Example: 5, 3, 8, 1, 9"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />

          <button
            type="button"
            onClick={handleApplyCustomArray}
            className="rounded-xl border border-cyan-500 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-500/10"
          >
            Apply Input
          </button>
        </div>

        {inputError ? (
          <p className="text-sm text-red-400">{inputError}</p>
        ) : (
          <p className="text-xs text-slate-400">
            Enter comma-separated positive numbers.
          </p>
        )}
      </div>
    </div>
  );
}