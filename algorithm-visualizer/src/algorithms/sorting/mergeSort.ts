import type { AlgorithmRunResult } from "../../types/algorithmResult";
import type { AnimationStep } from "../../types/animation";

export function mergeSortSteps(array: number[]): AlgorithmRunResult {
  const arr = [...array];
  const steps: AnimationStep[] = [];

  function merge(left: number, mid: number, right: number) {
    steps.push({ type: "line", line: 4 });
    steps.push({ type: "setRange", start: left, end: right });
    steps.push({ type: "setLeftRange", start: left, end: mid });
    steps.push({ type: "setRightRange", start: mid + 1, end: right });
    steps.push({
      type: "message",
      text: `Merging ranges ${left}-${mid} and ${mid + 1}-${right}`,
    });

    const leftPart = arr.slice(left, mid + 1);
    const rightPart = arr.slice(mid + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftPart.length && j < rightPart.length) {
      steps.push({ type: "line", line: 5 });
      steps.push({
        type: "compare",
        indices: [left + i, mid + 1 + j],
      });

      if (leftPart[i] <= rightPart[j]) {
        steps.push({ type: "line", line: 6 });
        steps.push({
          type: "overwrite",
          index: k,
          value: leftPart[i],
        });
        steps.push({
          type: "message",
          text: `Writing ${leftPart[i]} into index ${k}`,
        });

        arr[k] = leftPart[i];
        i += 1;
      } else {
        steps.push({ type: "line", line: 7 });
        steps.push({
          type: "overwrite",
          index: k,
          value: rightPart[j],
        });
        steps.push({
          type: "message",
          text: `Writing ${rightPart[j]} into index ${k}`,
        });

        arr[k] = rightPart[j];
        j += 1;
      }

      k += 1;
    }

    while (i < leftPart.length) {
      steps.push({ type: "line", line: 8 });
      steps.push({
        type: "overwrite",
        index: k,
        value: leftPart[i],
      });
      steps.push({
        type: "message",
        text: `Copying remaining left value ${leftPart[i]} into index ${k}`,
      });

      arr[k] = leftPart[i];
      i += 1;
      k += 1;
    }

    while (j < rightPart.length) {
      steps.push({ type: "line", line: 9 });
      steps.push({
        type: "overwrite",
        index: k,
        value: rightPart[j],
      });
      steps.push({
        type: "message",
        text: `Copying remaining right value ${rightPart[j]} into index ${k}`,
      });

      arr[k] = rightPart[j];
      j += 1;
      k += 1;
    }

    for (let index = left; index <= right; index += 1) {
      steps.push({ type: "line", line: 10 });
      steps.push({
        type: "markSorted",
        index,
      });
    }
  }

  function mergeSort(left: number, right: number) {
    steps.push({ type: "line", line: 1 });

    if (left >= right) {
      steps.push({ type: "line", line: 2 });
      return;
    }

    const mid = Math.floor((left + right) / 2);

    steps.push({ type: "line", line: 3 });
    steps.push({
      type: "message",
      text: `Splitting range ${left}-${right} at midpoint ${mid}`,
    });

    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
  }

  if (arr.length > 0) {
    mergeSort(0, arr.length - 1);

    steps.push({
      type: "message",
      text: "Merge Sort complete",
    });
  }

  return {
    steps,
    sortedArray: arr,
  };
}