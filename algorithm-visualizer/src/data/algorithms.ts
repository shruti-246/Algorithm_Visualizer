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
  {
    id: "linear-search",
    name: "Linear Search",
    category: "searching",
    description: "Checks each element sequentially until the target is found.",
    complexity: {
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
    },
  },
  {
    id: "binary-search",
    name: "Binary Search",
    category: "searching",
    description:
      "Searches a sorted array by repeatedly checking the middle element.",
    complexity: {
      best: "O(1)",
      average: "O(log n)",
      worst: "O(log n)",
      space: "O(1)",
    },
  },
  {
    id: "brute-force-match",
    name: "Brute Force String Matching",
    category: "string-matching",
    description: "Checks pattern alignment at every position in the text.",
    complexity: {
      best: "O(n)",
      average: "O(nm)",
      worst: "O(nm)",
      space: "O(1)",
    },
  },
  {
    id: "horspool",
    name: "Horspool String Matching",
    category: "string-matching",
    description:
      "Matches pattern characters from right to left and uses a shift table to skip ahead efficiently.",
    complexity: {
      best: "O(n / m)",
      average: "Sublinear",
      worst: "O(nm)",
      space: "O(m)",
    },
  },
  {
  id: "boyer-moore",
    name: "Boyer-Moore String Matching",
    category: "string-matching",
    description:
      "Matches from right to left and uses last-occurrence information to skip ahead efficiently.",
    complexity: {
      best: "Sublinear",
      average: "Sublinear",
      worst: "O(nm)",
      space: "O(m)",
    },
  }
];