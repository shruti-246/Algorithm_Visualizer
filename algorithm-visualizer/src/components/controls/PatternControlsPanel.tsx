import { useState } from "react";

interface PatternControlsPanelProps {
  text: string;
  pattern: string;
  speed: number;
  onTextChange: (value: string) => void;
  onPatternChange: (value: string) => void;
  onSpeedChange: (value: number) => void;
  onGenerateExample: () => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStep: () => void;
  onReset: () => void;
  onApplyInputs: (text: string, pattern: string) => void;
}

export default function PatternControlsPanel({
  text,
  pattern,
  speed,
  onTextChange,
  onPatternChange,
  onSpeedChange,
  onGenerateExample,
  onStart,
  onPause,
  onResume,
  onStep,
  onReset,
  onApplyInputs,
}: PatternControlsPanelProps) {
  const [draftText, setDraftText] = useState(text);
  const [draftPattern, setDraftPattern] = useState(pattern);
  const [inputError, setInputError] = useState("");

  const handleApplyInputs = () => {
    const cleanedText = draftText.trim().toUpperCase();
    const cleanedPattern = draftPattern.trim().toUpperCase();

    if (cleanedText.length === 0) {
      setInputError("Text cannot be empty.");
      return;
    }

    if (cleanedPattern.length === 0) {
      setInputError("Pattern cannot be empty.");
      return;
    }

    if (cleanedPattern.length > cleanedText.length) {
      setInputError("Pattern length cannot be greater than text length.");
      return;
    }

    setInputError("");
    onApplyInputs(cleanedText, cleanedPattern);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onGenerateExample}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500"
        >
          Example Input
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

      <div className="flex flex-wrap items-center gap-4">
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="string-text"
            className="block text-sm font-medium text-slate-200"
          >
            Text
          </label>

          <input
            id="string-text"
            type="text"
            value={draftText}
            onChange={(event) => {
              setDraftText(event.target.value);
              onTextChange(event.target.value.toUpperCase());
            }}
            placeholder="Example: THISISATEST"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm uppercase text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="string-pattern"
            className="block text-sm font-medium text-slate-200"
          >
            Pattern
          </label>

          <input
            id="string-pattern"
            type="text"
            value={draftPattern}
            onChange={(event) => {
              setDraftPattern(event.target.value);
              onPatternChange(event.target.value.toUpperCase());
            }}
            placeholder="Example: TEST"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm uppercase text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleApplyInputs}
          className="rounded-xl border border-cyan-500 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-500/10"
        >
          Apply Input
        </button>

        {inputError ? (
          <p className="text-sm text-red-400">{inputError}</p>
        ) : (
          <p className="text-xs text-slate-400">
            Text and pattern will be converted to uppercase.
          </p>
        )}
      </div>
    </div>
  );
}