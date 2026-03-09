import type { AlgorithmRunResult } from "../../types/algorithmResult";
import type { AnimationStep } from "../../types/animation";

export function bubbleSortSteps(array: number[]): AlgorithmRunResult {
  const arr = [...array];
  const steps: AnimationStep[] = [];
  const n = arr.length;

  steps.push({ type: "line", line: 1 });

  for (let i = 0; i < n - 1; i += 1) {
    steps.push({ type: "line", line: 2 });

    for (let j = 0; j < n - i - 1; j += 1) {
      steps.push({ type: "line", line: 3 });
      steps.push({
        type: "compare",
        indices: [j, j + 1],
      });

      steps.push({ type: "line", line: 4 });
      steps.push({
        type: "message",
        text: `Comparing index ${j} and index ${j + 1}`,
      });

      if (arr[j] > arr[j + 1]) {
        steps.push({ type: "line", line: 5 });
        steps.push({
          type: "swap",
          indices: [j, j + 1],
        });

        steps.push({ type: "line", line: 6 });
        steps.push({
          type: "message",
          text: `Swapping ${arr[j]} and ${arr[j + 1]}`,
        });

        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }

    steps.push({ type: "line", line: 7 });
    steps.push({
      type: "markSorted",
      index: n - i - 1,
    });

    steps.push({
      type: "message",
      text: `Element at index ${n - i - 1} is now in its sorted position`,
    });
  }

  if (n > 0) {
    steps.push({ type: "line", line: 8 });
    steps.push({
      type: "markSorted",
      index: 0,
    });

    steps.push({
      type: "message",
      text: "Sorting complete",
    });
  }

  return {
    steps,
    sortedArray: arr,
  };
}