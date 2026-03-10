import { describe, it, expect } from "vitest";
import { insertionSortSteps } from "../../algorithms/sorting/insertionSort";

describe("Insertion Sort Step Generator", () => {
  it("should sort array correctly", () => {
    const input = [7, 2, 5, 1];

    const result = insertionSortSteps(input);

    expect(result.sortedArray).toEqual([1, 2, 5, 7]);
  });

  it("should keep sorted array unchanged", () => {
    const input = [1, 2, 3, 4];

    const result = insertionSortSteps(input);

    expect(result.sortedArray).toEqual([1, 2, 3, 4]);
  });
});