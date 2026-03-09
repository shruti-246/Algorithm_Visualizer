import type { SearchRunResult, SearchStep } from "../../types/search";

export function linearSearchSteps(
  array: number[],
  target: number,
): SearchRunResult {
  const steps: SearchStep[] = [];

  steps.push({ type: "line", line: 1 });

  for (let index = 0; index < array.length; index += 1) {
    steps.push({ type: "line", line: 2 });
    steps.push({ type: "check", index });
    steps.push({
      type: "message",
      text: `Checking index ${index} with value ${array[index]}`,
    });

    steps.push({ type: "line", line: 3 });

    if (array[index] === target) {
      steps.push({ type: "line", line: 4 });
      steps.push({ type: "found", index });
      steps.push({
        type: "message",
        text: `Found target ${target} at index ${index}`,
      });

      return {
        steps,
        foundIndex: index,
      };
    }
  }

  steps.push({ type: "line", line: 5 });
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