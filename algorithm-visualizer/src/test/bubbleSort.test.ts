import { describe, it, expect } from "vitest";
import { bubbleSortSteps } from "../algorithms/sorting/bubbleSort";

describe("Bubble Sort Step Generator", () => {
  it("should sort an unsorted array", () => {
    const input = [5, 3, 8, 1];

    const result = bubbleSortSteps(input);

    expect(result.sortedArray).toEqual([1, 3, 5, 8]);
  });

  it("should handle already sorted array", () => {
    const input = [1, 2, 3, 4];

    const result = bubbleSortSteps(input);

    expect(result.sortedArray).toEqual([1, 2, 3, 4]);
  });

  it("should handle reverse sorted array", () => {
    const input = [5, 4, 3, 2, 1];

    const result = bubbleSortSteps(input);

    expect(result.sortedArray).toEqual([1, 2, 3, 4, 5]);
  });

  it("should generate animation steps", () => {
    const input = [3, 2, 1];

    const result = bubbleSortSteps(input);

    expect(result.steps.length).toBeGreaterThan(0);
  });
});