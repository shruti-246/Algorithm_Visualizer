interface SearchArrayViewProps {
  array: number[];
  activeIndex: number | null;
  foundIndex: number | null;
  midIndex?: number | null;
  rangeLeft?: number | null;
  rangeRight?: number | null;
}

export default function SearchArrayView({
  array,
  activeIndex,
  foundIndex,
  midIndex = null,
  rangeLeft = null,
  rangeRight = null,
}: SearchArrayViewProps) {
  return (
    <div className="flex flex-wrap gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-6">
      {array.map((value, index) => {
        const isActive = activeIndex === index;
        const isFound = foundIndex === index;
        const isMid = midIndex === index;

        const isInRange =
          rangeLeft !== null &&
          rangeRight !== null &&
          index >= rangeLeft &&
          index <= rangeRight;

        let cellClassName = "border-slate-700 bg-slate-900 text-slate-200";

        if (isFound) {
          cellClassName =
            "border-emerald-400 bg-emerald-500/15 text-emerald-200";
        } else if (isMid) {
          cellClassName = "border-violet-400 bg-violet-500/15 text-violet-200";
        } else if (isActive) {
          cellClassName = "border-amber-400 bg-amber-500/15 text-amber-200";
        } else if (isInRange) {
          cellClassName = "border-cyan-700 bg-cyan-500/10 text-cyan-100";
        }

        return (
          <div
            key={`${index}-${value}`}
            className={`flex h-16 w-16 flex-col items-center justify-center rounded-xl border transition ${cellClassName}`}
          >
            <span className="text-lg font-semibold">{value}</span>
            <span className="mt-1 text-xs opacity-70">#{index}</span>
          </div>
        );
      })}
    </div>
  );
}