import { describe, it, expect } from "vitest";
import { quickSortSteps } from "../algorithms/sorting/quickSort";

describe("Quick Sort Step Generator", () => {
  it("should sort array correctly", () => {
    const input = [9, 4, 7, 1];

    const result = quickSortSteps(input);

    expect(result.sortedArray).toEqual([1, 4, 7, 9]);
  });

  it("should generate steps", () => {
    const input = [3, 1, 2];

    const result = quickSortSteps(input);

    expect(result.steps.length).toBeGreaterThan(0);
  });
});