import type { SearchRunResult, SearchStep } from "../../types/search";

export function binarySearchSteps(
  array: number[],
  target: number,
): SearchRunResult {
  const steps: SearchStep[] = [];
  const sortedArray = [...array].sort((a, b) => a - b);

  let left = 0;
  let right = sortedArray.length - 1;

  steps.push({ type: "line", line: 1 });

  while (left <= right) {
    steps.push({ type: "line", line: 2 });
    steps.push({ type: "setRange", left, right });
    steps.push({
      type: "message",
      text: `Searching between index ${left} and ${right}`,
    });

    const mid = Math.floor((left + right) / 2);

    steps.push({ type: "line", line: 3 });
    steps.push({ type: "setMid", index: mid });
    steps.push({
      type: "message",
      text: `Checking middle index ${mid} with value ${sortedArray[mid]}`,
    });

    steps.push({ type: "line", line: 4 });
    steps.push({ type: "check", index: mid });

    if (sortedArray[mid] === target) {
      steps.push({ type: "line", line: 5 });
      steps.push({ type: "found", index: mid });
      steps.push({
        type: "message",
        text: `Found target ${target} at index ${mid}`,
      });

      return {
        steps,
        foundIndex: mid,
      };
    }

    if (sortedArray[mid] < target) {
      steps.push({ type: "line", line: 6 });
      steps.push({
        type: "message",
        text: `${sortedArray[mid]} is smaller than ${target}, searching right half`,
      });
      left = mid + 1;
    } else {
      steps.push({ type: "line", line: 7 });
      steps.push({
        type: "message",
        text: `${sortedArray[mid]} is greater than ${target}, searching left half`,
      });
      right = mid - 1;
    }
  }

  steps.push({ type: "line", line: 8 });
  steps.push({ type: "notFound" });
  steps.push({
    type: "message",
    text: `Target ${target} was not found in the array`,
  });

  return {
    steps,
    foundIndex: -1,
  };
}