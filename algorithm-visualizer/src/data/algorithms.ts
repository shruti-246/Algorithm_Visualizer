import type { Algorithm } from "../types/algorithm";

export const algorithms: Algorithm[] = [
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    category: "sorting",
    description: "Repeatedly swaps adjacent elements if they are in the wrong order.",
    complexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
    },
  },
  {
    id: "insertion-sort",
    name: "Insertion Sort",
    category: "sorting",
    description: "Builds the sorted array one element at a time.",
    complexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
    },
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    category: "sorting",
    description: "Divide-and-conquer algorithm using pivot partitioning.",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)",
      space: "O(log n)",
    },
  },
];