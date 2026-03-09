import { useState } from "react";
import { useParams } from "react-router-dom";
import { bubbleSortSteps } from "../algorithms/sorting/bubbleSort";
import { insertionSortSteps } from "../algorithms/sorting/insertionSort";
import { quickSortSteps } from "../algorithms/sorting/quickSort";
import SortingVisualizer from "../components/visualizers/SortingVisualizer";
import { algorithms } from "../data/algorithms";
import { linearSearchSteps } from "../algorithms/searching/linearSearch";
import SearchingVisualizer from "../components/visualizers/SearchingVisualizer";
import { binarySearchSteps } from "../algorithms/searching/binarySearch";
import { bruteForceMatchSteps } from "../algorithms/stringMatching/bruteForceMatch";
import StringMatchingVisualizer from "../components/visualizers/StringMatchingVisualizer";
import { horspoolSteps } from "../algorithms/stringMatching/horspool";
import { boyerMooreSteps } from "../algorithms/stringMatching/boyerMoore";
import { mergeSortSteps } from "../algorithms/sorting/mergeSort";

type AlgorithmCase = "best" | "average" | "worst" | null;

const bubbleSortPseudocode = [
  "for i = 0 to n - 2",
  "  for j = 0 to n - i - 2",
  "    compare A[j] and A[j + 1]",
  '    show message "comparing"',
  "    if A[j] > A[j + 1]",
  "      swap A[j] and A[j + 1]",
  "  mark final element of pass as sorted",
  "mark first element as sorted",
];

const insertionSortPseudocode = [
  "for i = 1 to n - 1",
  "  set current position",
  "  show insertion message",
  "  while j > 0 and A[j - 1] > A[j]",
  "    compare adjacent elements",
  "    swap adjacent elements",
  "mark all elements as sorted",
];

const quickSortPseudocode = [
  "quickSort(low, high)",
  "choose pivot = A[high]",
  "highlight pivot",
  "initialize i = low - 1",
  "for j = low to high - 1 compare with pivot",
  "if A[j] <= pivot increment i",
  "swap A[i] and A[j] when needed",
  "swap pivot into correct position",
  "mark pivot as sorted",
  "quickSort(left partition)",
  "quickSort(right partition)",
  "if single element mark as sorted",
];

const mergeSortPseudocode = [
  "if subarray size <= 1 return",
  "find midpoint",
  "recursively sort left and right halves",
  "begin merge of two halves",
  "compare front elements of both halves",
  "write smaller value into merged array",
  "write smaller value into merged array",
  "copy remaining left values",
  "copy remaining right values",
  "mark merged range as sorted",
];

const linearSearchPseudocode = [
  "for each index in array",
  "  check current element",
  "  if current element equals target",
  "    return found index",
  "return not found",
];

const binarySearchPseudocode = [
  "set left = 0 and right = n - 1",
  "while left <= right",
  "  set middle index",
  "  check middle element",
  "  if middle equals target return found",
  "  if middle < target search right half",
  "  else search left half",
  "return not found",
];

const bruteForcePseudocode = [
  "for each alignment position",
  "  compare pattern with text",
  "  if all characters match return position",
  "shift pattern by one",
  "return not found",
];

const horspoolPseudocode = [
  "build shift table for pattern",
  "align pattern with text",
  "compare from right to left",
  "check current character pair",
  "if characters match continue left",
  "if mismatch compute shift from text character",
  "shift pattern by table value",
  "if all characters match return position",
  "return not found",
];

const boyerMoorePseudocode = [
  "build last-occurrence table for pattern",
  "align pattern with text",
  "compare from right to left",
  "check current character pair",
  "if characters match continue left",
  "if mismatch use last occurrence to compute shift",
  "shift pattern by bad-character rule",
  "if all characters match return position",
  "return not found",
];

export default function Visualizer() {
  const { algorithmId } = useParams();
  const [detectedCase, setDetectedCase] = useState<AlgorithmCase>(null);

  const algorithm = algorithms.find((item) => item.id === algorithmId);

  if (!algorithm) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-12">
        <h1 className="text-3xl font-bold text-white">Algorithm not found</h1>
        <p className="mt-3 text-slate-300">
          The requested visualizer does not exist yet.
        </p>
      </section>
    );
  }

  const bestHighlight =
    detectedCase === "best"
      ? "border-emerald-400 ring-1 ring-emerald-400"
      : "border-slate-800";

  const averageHighlight =
    detectedCase === "average"
      ? "border-amber-400 ring-1 ring-amber-400"
      : "border-slate-800";

  const worstHighlight =
    detectedCase === "worst"
      ? "border-red-400 ring-1 ring-red-400"
      : "border-slate-800";

  let visualizerContent: React.ReactNode = (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-lg font-semibold text-white">Visualizer coming soon</h2>
      <p className="mt-3 text-sm text-slate-300">
        This algorithm is registered in the system, but its visualization
        component has not been implemented yet.
      </p>
    </div>
  );

  if (algorithm.id === "bubble-sort") {
    visualizerContent = (
      <SortingVisualizer
        title="Bubble Sort"
        pseudocodeLines={bubbleSortPseudocode}
        generateSteps={bubbleSortSteps}
        enableCaseDetection
        onCaseDetected={setDetectedCase}
      />
    );
  }

  if (algorithm.id === "insertion-sort") {
    visualizerContent = (
      <SortingVisualizer
        title="Insertion Sort"
        pseudocodeLines={insertionSortPseudocode}
        generateSteps={insertionSortSteps}
        enableCaseDetection
        onCaseDetected={setDetectedCase}
      />
    );
  }

  if (algorithm.id === "quick-sort") {
    visualizerContent = (
      <SortingVisualizer
        title="Quick Sort"
        pseudocodeLines={quickSortPseudocode}
        generateSteps={quickSortSteps}
        onCaseDetected={setDetectedCase}
      />
    );
  }

  if (algorithm.id === "merge-sort") {
    visualizerContent = (
      <SortingVisualizer
        title="Merge Sort"
        pseudocodeLines={mergeSortPseudocode}
        generateSteps={mergeSortSteps}
        onCaseDetected={setDetectedCase}
      />
    );
  }

  if (algorithm.id === "linear-search") {
    visualizerContent = (
      <SearchingVisualizer
        title="Linear Search"
        pseudocodeLines={linearSearchPseudocode}
        searchType="linear"
        generateSteps={linearSearchSteps}
        onCaseDetected={setDetectedCase}
      />
    );
  }

  if (algorithm.id === "binary-search") {
    visualizerContent = (
      <SearchingVisualizer
        title="Binary Search"
        pseudocodeLines={binarySearchPseudocode}
        searchType="binary"
        generateSteps={binarySearchSteps}
        autoSortArray
        onCaseDetected={setDetectedCase}
      />
    );
  }

  if (algorithm.id === "brute-force-match") {
    visualizerContent = (
      <StringMatchingVisualizer
        title="Brute Force String Matching"
        pseudocodeLines={bruteForcePseudocode}
        generateSteps={bruteForceMatchSteps}
        onCaseDetected={setDetectedCase}
      />
    );
  }

  if (algorithm.id === "horspool") {
    visualizerContent = (
      <StringMatchingVisualizer
        title="Horspool String Matching"
        pseudocodeLines={horspoolPseudocode}
        generateSteps={horspoolSteps}
        onCaseDetected={setDetectedCase}
      />
    );
  }

  if (algorithm.id === "boyer-moore") {
    visualizerContent = (
      <StringMatchingVisualizer
        title="Boyer-Moore String Matching"
        pseudocodeLines={boyerMoorePseudocode}
        generateSteps={boyerMooreSteps}
        onCaseDetected={setDetectedCase}
      />
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wide text-cyan-400">
          {algorithm.category}
        </p>

        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
          {algorithm.name}
        </h1>

        <p className="mt-3 max-w-2xl text-slate-300">{algorithm.description}</p>
      </div>

      {visualizerContent}

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div
          className={`rounded-2xl border ${bestHighlight} bg-slate-900/60 p-6 transition`}
        >
          <h2 className="text-lg font-semibold text-white">Best Case</h2>
          <p className="mt-3 text-slate-300">{algorithm.complexity.best ?? "—"}</p>
        </div>

        <div
          className={`rounded-2xl border ${averageHighlight} bg-slate-900/60 p-6 transition`}
        >
          <h2 className="text-lg font-semibold text-white">Average Case</h2>
          <p className="mt-3 text-slate-300">
            {algorithm.complexity.average ?? "—"}
          </p>
        </div>

        <div
          className={`rounded-2xl border ${worstHighlight} bg-slate-900/60 p-6 transition`}
        >
          <h2 className="text-lg font-semibold text-white">Worst Case</h2>
          <p className="mt-3 text-slate-300">{algorithm.complexity.worst ?? "—"}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold text-white">Space</h2>
          <p className="mt-3 text-slate-300">{algorithm.complexity.space ?? "—"}</p>
        </div>
      </div>
    </section>
  );
}