export type BubbleSortCase = "best" | "average" | "worst";

function isAscending(array: number[]): boolean {
  for (let index = 0; index < array.length - 1; index += 1) {
    if (array[index] > array[index + 1]) {
      return false;
    }
  }
  return true;
}

function isDescending(array: number[]): boolean {
  for (let index = 0; index < array.length - 1; index += 1) {
    if (array[index] < array[index + 1]) {
      return false;
    }
  }
  return true;
}

export function classifyBubbleSortCase(array: number[]): BubbleSortCase {
  if (isAscending(array)) {
    return "best";
  }

  if (isDescending(array)) {
    return "worst";
  }

  return "average";
}