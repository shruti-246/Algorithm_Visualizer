interface BarsChartProps {
  array: number[];
  activeIndices: number[];
  sortedIndices: number[];
  pivotIndex?: number | null;
}

export default function BarsChart({
  array,
  activeIndices,
  sortedIndices,
  pivotIndex = null,
}: BarsChartProps) {
  const maxValue = Math.max(...array, 1);

  return (
    <div className="flex min-h-[380px] items-end justify-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-6">
      {array.map((value, index) => {
        const isActive = activeIndices.includes(index);
        const isSorted = sortedIndices.includes(index);
        const isPivot = pivotIndex === index;

        let barColor = "bg-slate-500";

        if (isSorted) {
          barColor = "bg-emerald-500";
        } else if (isPivot) {
          barColor = "bg-violet-500";
        } else if (isActive) {
          barColor = "bg-amber-400";
        }

        return (
          <div
            key={`${index}-${value}`}
            className="flex w-full max-w-[40px] flex-col items-center justify-end gap-2"
          >
            <div
              className={`w-full rounded-t-md transition-all duration-300 ${barColor}`}
              style={{
                height: `${(value / maxValue) * 260}px`,
              }}
            />
            <span className="text-xs text-slate-300">{value}</span>
          </div>
        );
      })}
    </div>
  );
}