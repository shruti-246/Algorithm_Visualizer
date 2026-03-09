import type { AlgorithmRunResult } from "../../types/algorithmResult";
import type { AnimationStep } from "../../types/animation";

export function quickSortSteps(array: number[]): AlgorithmRunResult {
  const arr = [...array];
  const steps: AnimationStep[] = [];

  function partition(low: number, high: number): number {
    steps.push({ type: "line", line: 2 });
    const pivotValue = arr[high];

    steps.push({ type: "line", line: 3 });
    steps.push({
      type: "pivot",
      index: high,
    });

    steps.push({
      type: "message",
      text: `Selected pivot ${pivotValue} at index ${high}`,
    });

    let i = low - 1;

    steps.push({ type: "line", line: 4 });
    for (let j = low; j < high; j += 1) {
      steps.push({ type: "line", line: 5 });
      steps.push({
        type: "compare",
        indices: [j, high],
      });

      steps.push({
        type: "message",
        text: `Comparing ${arr[j]} with pivot ${pivotValue}`,
      });

      if (arr[j] <= pivotValue) {
        steps.push({ type: "line", line: 6 });
        i += 1;

        if (i !== j) {
          steps.push({ type: "line", line: 7 });
          steps.push({
            type: "swap",
            indices: [i, j],
          });

          steps.push({
            type: "message",
            text: `Swapping ${arr[i]} and ${arr[j]}`,
          });

          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
    }

    steps.push({ type: "line", line: 8 });
    if (i + 1 !== high) {
      steps.push({
        type: "swap",
        indices: [i + 1, high],
      });

      steps.push({
        type: "message",
        text: `Placing pivot ${pivotValue} into its correct position`,
      });

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    }

    steps.push({ type: "line", line: 9 });
    steps.push({
      type: "markSorted",
      index: i + 1,
    });

    return i + 1;
  }

  function quickSort(low: number, high: number) {
    steps.push({ type: "line", line: 1 });

    if (low < high) {
      const pivotIndex = partition(low, high);

      steps.push({ type: "line", line: 10 });
      quickSort(low, pivotIndex - 1);

      steps.push({ type: "line", line: 11 });
      quickSort(pivotIndex + 1, high);
    } else if (low === high) {
      steps.push({ type: "line", line: 12 });
      steps.push({
        type: "markSorted",
        index: low,
      });
    }
  }

  quickSort(0, arr.length - 1);

  steps.push({
    type: "message",
    text: "Quick Sort complete",
  });

  return {
    steps,
    sortedArray: arr,
  };
}