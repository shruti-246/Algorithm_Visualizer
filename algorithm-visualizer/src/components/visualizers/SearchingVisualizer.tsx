import { useEffect, useMemo, useRef, useState } from "react";
import PseudocodePanel from "../panels/PseudocodePanel";
import SearchControlsPanel from "../controls/SearchControlsPanel";
import SearchArrayView from "../views/SearchArrayView";
import type { SearchRunResult, SearchStep } from "../../types/search";
import { generateRandomArray } from "../../utils/generateRandomArray";

const DEFAULT_ARRAY_SIZE = 10;

type AlgorithmCase = "best" | "average" | "worst" | null;

interface SearchingVisualizerProps {
  title: string;
  pseudocodeLines: string[];
  generateSteps: (array: number[], target: number) => SearchRunResult;
  autoSortArray?: boolean;
  searchType: "linear" | "binary";
  onCaseDetected?: (value: AlgorithmCase) => void;
}

interface SearchMetrics {
  checks: number;
  //totalSteps: number;
  arraySize: number;
}

function getSearchMetrics(
  steps: SearchStep[],
  arraySize: number,
): SearchMetrics {
  return {
    checks: steps.filter((step) => step.type === "check").length,
    //totalSteps: steps.length,
    arraySize,
  };
}

function prepareArray(array: number[], autoSortArray: boolean): number[] {
  if (!autoSortArray) {
    return array;
  }

  return [...array].sort((a, b) => a - b);
}

function classifyLinearSearchCase(
  result: SearchRunResult,
  arrayLength: number,
): AlgorithmCase {
  if (result.foundIndex === 0) {
    return "best";
  }

  if (result.foundIndex === -1 || result.foundIndex === arrayLength - 1) {
    return "worst";
  }

  return "average";
}

function classifyBinarySearchCase(result: SearchRunResult): AlgorithmCase {
  if (result.foundIndex === -1) {
    return "worst";
  }

  const checkCount = result.steps.filter((step) => step.type === "check").length;

  if (checkCount <= 1) {
    return "best";
  }

  return "average";
}

export default function SearchingVisualizer({
  title,
  pseudocodeLines,
  generateSteps,
  autoSortArray = false,
  searchType,
  onCaseDetected,
}: SearchingVisualizerProps) {
  const initialBaseArray = useMemo(
    () => generateRandomArray(DEFAULT_ARRAY_SIZE),
    [],
  );
  const initialArray = useMemo(
    () => prepareArray(initialBaseArray, autoSortArray),
    [initialBaseArray, autoSortArray],
  );
  const initialTarget = initialArray[0] ?? 0;

  const [array, setArray] = useState<number[]>(initialArray);
  const [originalArray, setOriginalArray] = useState<number[]>(initialArray);
  const [target, setTarget] = useState<number>(initialTarget);
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [midIndex, setMidIndex] = useState<number | null>(null);
  const [rangeLeft, setRangeLeft] = useState<number | null>(null);
  const [rangeRight, setRangeRight] = useState<number | null>(null);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [message, setMessage] = useState("Generate an array and start searching.");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [metrics, setMetrics] = useState<SearchMetrics>({
    checks: 0,
    //totalSteps: 0,
    arraySize: initialArray.length,
  });
  const [detectedCase, setDetectedCase] = useState<AlgorithmCase>(null);
  const [pendingCase, setPendingCase] = useState<AlgorithmCase>(null);

  const timeoutRef = useRef<number | null>(null);

  const resetPlaybackState = () => {
    setCurrentStepIndex(0);
    setActiveIndex(null);
    setFoundIndex(null);
    setMidIndex(null);
    setRangeLeft(null);
    setRangeRight(null);
    setActiveLine(null);
    setIsPlaying(false);
    setDetectedCase(null);
    setPendingCase(null);
    setMessage(`Ready to start ${title}.`);
    setMetrics({
      checks: 0,
      //totalSteps: 0,
      arraySize: originalArray.length,
    });

    if (onCaseDetected) {
      onCaseDetected(null);
    }
  };

  const generateNewArray = () => {
    const baseArray = generateRandomArray(DEFAULT_ARRAY_SIZE);
    const nextArray = prepareArray(baseArray, autoSortArray);

    setArray(nextArray);
    setOriginalArray(nextArray);
    setTarget(nextArray[0] ?? 0);
    setSteps([]);
    setMetrics({
      checks: 0,
      //totalSteps: 0,
      arraySize: nextArray.length,
    });
    resetPlaybackState();
  };

  const applyCustomArray = (values: number[]) => {
    const nextArray = prepareArray(values, autoSortArray);

    setArray(nextArray);
    setOriginalArray(nextArray);
    setTarget(nextArray[0] ?? 0);
    setSteps([]);
    setMetrics({
      checks: 0,
      //totalSteps: 0,
      arraySize: nextArray.length,
    });
    resetPlaybackState();
    setMessage(`Custom array applied. Ready to start ${title}.`);
  };

  const startVisualization = () => {
    const result = generateSteps(originalArray, target);

    const nextCase =
      searchType === "linear"
        ? classifyLinearSearchCase(result, originalArray.length)
        : classifyBinarySearchCase(result);

    setPendingCase(nextCase);
    setDetectedCase(null);

    if (onCaseDetected) {
      onCaseDetected(null);
    }

    setMetrics(getSearchMetrics(result.steps, originalArray.length));
    setArray([...originalArray]);
    setSteps(result.steps);
    setCurrentStepIndex(0);
    setActiveIndex(null);
    setFoundIndex(null);
    setMidIndex(null);
    setRangeLeft(null);
    setRangeRight(null);
    setActiveLine(null);
    setMessage(`Starting ${title}...`);
    setIsPlaying(true);
  };

  const resetVisualization = () => {
    setArray([...originalArray]);
    setSteps([]);
    resetPlaybackState();
  };

  const pauseVisualization = () => {
    setIsPlaying(false);
  };

  const resumeVisualization = () => {
    if (steps.length === 0 || currentStepIndex >= steps.length) return;
    setIsPlaying(true);
  };

  const processStep = (step: SearchStep) => {
    if (step.type === "line") {
      setActiveLine(step.line);
    }

    if (step.type === "message") {
      setMessage(step.text);
    }

    if (step.type === "check") {
      setActiveIndex(step.index);
    }

    if (step.type === "found") {
      setFoundIndex(step.index);
      setActiveIndex(step.index);
    }

    if (step.type === "notFound") {
      setFoundIndex(null);
      setActiveIndex(null);
    }

    if (step.type === "setMid") {
      setMidIndex(step.index);
    }

    if (step.type === "setRange") {
      setRangeLeft(step.left);
      setRangeRight(step.right);
    }
  };

  const finishVisualization = () => {
    setIsPlaying(false);
    setMessage("Search complete.");
    setDetectedCase(pendingCase);

    if (onCaseDetected) {
      onCaseDetected(pendingCase);
    }
  };

  const stepForward = () => {
    if (currentStepIndex >= steps.length) {
      finishVisualization();
      return;
    }

    const step = steps[currentStepIndex];
    processStep(step);

    const nextIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextIndex);

    if (nextIndex >= steps.length) {
      finishVisualization();
    }
  };

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStepIndex >= steps.length) {
      finishVisualization();
      return;
    }

    const step = steps[currentStepIndex];

    timeoutRef.current = window.setTimeout(() => {
      processStep(step);

      setCurrentStepIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= steps.length) {
          finishVisualization();
        }
        return nextIndex;
      });
    }, speed);

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [currentStepIndex, isPlaying, speed, steps, pendingCase]);

  return (
    <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              {title} Visualization
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Step-based search playback with target checking.
            </p>
          </div>

          <SearchControlsPanel
            target={target}
            speed={speed}
            onTargetChange={setTarget}
            onSpeedChange={setSpeed}
            onGenerateNewArray={generateNewArray}
            onStart={startVisualization}
            onPause={pauseVisualization}
            onResume={resumeVisualization}
            onStep={stepForward}
            onReset={resetVisualization}
            onApplyCustomArray={applyCustomArray}
          />

          <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex flex-wrap gap-6 text-sm text-slate-300">
              <p>
                Target value:{" "}
                <span className="font-semibold text-cyan-300">{target}</span>
              </p>

              {autoSortArray && (
                <p className="text-slate-400">
                  Array is automatically sorted for Binary Search
                </p>
              )}
            </div>
          </div>

          <SearchArrayView
            array={array}
            activeIndex={activeIndex}
            foundIndex={foundIndex}
            midIndex={midIndex}
            rangeLeft={rangeLeft}
            rangeRight={rangeRight}
          />
        </div>

        <PseudocodePanel
          title="Pseudocode"
          lines={pseudocodeLines}
          activeLine={activeLine}
        />
      </div>

      <div className="space-y-6">
        <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Current Status</h3>
          <p className="mt-3 text-sm text-slate-300">{message}</p>
        </aside>

        <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Search Metrics</h3>

          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-4">
              <span>Checks</span>
              <span className="font-semibold text-white">{metrics.checks}</span>
            </div>

            {/* <div className="flex items-center justify-between gap-4">
              <span>Total Steps</span>
              <span className="font-semibold text-white">
                {metrics.totalSteps}
              </span>
            </div> */}

            <div className="flex items-center justify-between gap-4">
              <span>Array Size</span>
              <span className="font-semibold text-white">
                {metrics.arraySize}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Target</span>
              <span className="font-semibold text-cyan-300">{target}</span>
            </div>
          </div>
        </aside>

        <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Detected Input Case</h3>
          <p className="mt-3 text-sm text-slate-300">
            {detectedCase === null
              ? "Run the visualization to classify the current search."
              : detectedCase === "best"
                ? "Best Case"
                : detectedCase === "worst"
                  ? "Worst Case"
                  : "Average Case"}
          </p>
        </aside>

        <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Legend</h3>

          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-slate-700" />
              <span>Default</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-cyan-500/30" />
              <span>Current search range</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-violet-500/60" />
              <span>Middle index</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-amber-500/60" />
              <span>Currently checking</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-emerald-500/60" />
              <span>Found target</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}