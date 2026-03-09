interface PatternViewProps {
  text: string;
  pattern: string;
  alignment: number;
  activeTextIndex: number | null;
  activePatternIndex: number | null;
  matchedPairs: Array<{ textIndex: number; patternIndex: number }>;
  mismatchedPair: { textIndex: number; patternIndex: number } | null;
  foundIndex: number | null;
}

export default function PatternView({
  text,
  pattern,
  alignment,
  activeTextIndex,
  activePatternIndex,
  matchedPairs,
  mismatchedPair,
  foundIndex,
}: PatternViewProps) {
  const matchSet = new Set(
    matchedPairs.map((pair) => `${pair.textIndex}-${pair.patternIndex}`),
  );

  return (
    <div className="space-y-8 rounded-xl border border-slate-800 bg-slate-950/50 p-6">
      <div>
        <p className="mb-3 text-sm font-medium text-slate-300">Text</p>
        <div className="flex flex-wrap gap-2">
          {text.split("").map((char, index) => {
            const isActive = activeTextIndex === index;
            const isMatched = matchedPairs.some((pair) => pair.textIndex === index);
            const isMismatch = mismatchedPair?.textIndex === index;
            const isFoundWindow =
              foundIndex !== null &&
              index >= foundIndex &&
              index < foundIndex + pattern.length;

            let className = "border-slate-700 bg-slate-900 text-slate-200";

            if (isMismatch) {
              className = "border-red-400 bg-red-500/15 text-red-200";
            } else if (isMatched || isFoundWindow) {
              className = "border-emerald-400 bg-emerald-500/15 text-emerald-200";
            } else if (isActive) {
              className = "border-amber-400 bg-amber-500/15 text-amber-200";
            }

            return (
              <div
                key={`text-${index}-${char}`}
                className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl border transition ${className}`}
              >
                <span className="text-lg font-semibold">{char}</span>
                <span className="mt-1 text-xs opacity-70">#{index}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-slate-300">Pattern</p>

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: alignment }).map((_, index) => (
            <div key={`spacer-${index}`} className="h-14 w-14 opacity-0" />
          ))}

          {pattern.split("").map((char, patternIndex) => {
            const textIndex = alignment + patternIndex;

            const isActive = activePatternIndex === patternIndex;
            const isMatched = matchSet.has(`${textIndex}-${patternIndex}`);
            const isMismatch =
              mismatchedPair?.textIndex === textIndex &&
              mismatchedPair?.patternIndex === patternIndex;
            const isFoundWindow = foundIndex === alignment;

            let className = "border-cyan-700 bg-cyan-500/10 text-cyan-100";

            if (isMismatch) {
              className = "border-red-400 bg-red-500/15 text-red-200";
            } else if (isMatched || isFoundWindow) {
              className = "border-emerald-400 bg-emerald-500/15 text-emerald-200";
            } else if (isActive) {
              className = "border-amber-400 bg-amber-500/15 text-amber-200";
            }

            return (
              <div
                key={`pattern-${patternIndex}-${char}`}
                className={`flex h-14 w-14 items-center justify-center rounded-xl border transition ${className}`}
              >
                <span className="text-lg font-semibold">{char}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}