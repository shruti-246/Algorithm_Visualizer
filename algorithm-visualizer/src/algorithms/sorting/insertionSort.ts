import type { AlgorithmRunResult } from "../../types/algorithmResult";
import type { AnimationStep } from "../../types/animation";

export function insertionSortSteps(array: number[]): AlgorithmRunResult {
  const arr = [...array];
  const steps: AnimationStep[] = [];

  steps.push({ type: "line", line: 1 });

  for (let i = 1; i < arr.length; i += 1) {
    steps.push({ type: "line", line: 2 });

    let j = i;

    steps.push({ type: "line", line: 3 });
    steps.push({
      type: "message",
      text: `Inserting element ${arr[i]} into sorted portion`,
    });

    while (j > 0 && arr[j - 1] > arr[j]) {
      steps.push({ type: "line", line: 4 });
      steps.push({
        type: "compare",
        indices: [j - 1, j],
      });

      steps.push({ type: "line", line: 5 });
      steps.push({
        type: "swap",
        indices: [j - 1, j],
      });

      steps.push({ type: "line", line: 6 });
      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];

      j -= 1;
    }
  }

  steps.push({ type: "line", line: 7 });
  for (let i = 0; i < arr.length; i += 1) {
    steps.push({
      type: "markSorted",
      index: i,
    });
  }

  steps.push({
    type: "message",
    text: "Insertion Sort complete",
  });

  return {
    steps,
    sortedArray: arr,
  };
}