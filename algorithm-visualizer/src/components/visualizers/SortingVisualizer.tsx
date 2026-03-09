import { useEffect, useMemo, useRef, useState } from "react";
import type { AlgorithmRunResult } from "../../types/algorithmResult";
import type { AnimationStep } from "../../types/animation";
import { generateRandomArray } from "../../utils/generateRandomArray";
import BarsChart from "../views/BarsChart";
import ControlsPanel from "../controls/ControlsPanel";
import PseudocodePanel from "../panels/PseudocodePanel";

const DEFAULT_ARRAY_SIZE = 12;

type AlgorithmCase = "best" | "average" | "worst" | null;

interface SortingVisualizerProps {
  title: string;
  pseudocodeLines: string[];
  onCaseDetected?: (value: AlgorithmCase) => void;
  generateSteps: (array: number[]) => AlgorithmRunResult;
  enableCaseDetection?: boolean;
}

interface OperationCounts {
  comparisons: number;
  swaps: number;
  totalSteps: number;
  arraySize: number;
}

function applySwap(arr: number[], firstIndex: number, secondIndex: number) {
  const next = [...arr];
  [next[firstIndex], next[secondIndex]] = [next[secondIndex], next[firstIndex]];
  return next;
}

function isAscending(array: number[]): boolean {
  for (let i = 0; i < array.length - 1; i += 1) {
    if (array[i] > array[i + 1]) return false;
  }
  return true;
}

function isDescending(array: number[]): boolean {
  for (let i = 0; i < array.length - 1; i += 1) {
    if (array[i] < array[i + 1]) return false;
  }
  return true;
}

function classifyCase(array: number[]): AlgorithmCase {
  if (array.length === 0) return null;
  if (isAscending(array)) return "best";
  if (isDescending(array)) return "worst";
  return "average";
}

function getOperationCounts(
  steps: AnimationStep[],
  arraySize: number,
): OperationCounts {
  const comparisons = steps.filter((step) => step.type === "compare").length;
  const swaps = steps.filter((step) => step.type === "swap").length;

  return {
    comparisons,
    swaps,
    totalSteps: steps.length,
    arraySize,
  };
}

export default function SortingVisualizer({
  title,
  pseudocodeLines,
  onCaseDetected,
  generateSteps,
  enableCaseDetection = false,
}: SortingVisualizerProps) {
  const initialArray = useMemo(
    () => generateRandomArray(DEFAULT_ARRAY_SIZE),
    [],
  );

  const [array, setArray] = useState<number[]>(initialArray);
  const [originalArray, setOriginalArray] = useState<number[]>(initialArray);
  const [steps, setSteps] = useState<AnimationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [pivotIndex, setPivotIndex] = useState<number | null>(null);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [message, setMessage] = useState("Generate an array and start sorting.");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [detectedCase, setDetectedCase] = useState<AlgorithmCase>(null);
  const [pendingCase, setPendingCase] = useState<AlgorithmCase>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [operationCounts, setOperationCounts] = useState<OperationCounts>({
    comparisons: 0,
    swaps: 0,
    totalSteps: 0,
    arraySize: initialArray.length,
  });

  const timeoutRef = useRef<number | null>(null);

  const resetPlaybackState = () => {
    setCurrentStepIndex(0);
    setActiveIndices([]);
    setSortedIndices([]);
    setPivotIndex(null);
    setActiveLine(null);
    setIsPlaying(false);
    setIsComplete(false);
    setDetectedCase(null);
    setPendingCase(null);
    setMessage(`Ready to start ${title}.`);
    setOperationCounts({
      comparisons: 0,
      swaps: 0,
      totalSteps: 0,
      arraySize: originalArray.length,
    });

    if (onCaseDetected) {
      onCaseDetected(null);
    }
  };

  const finishVisualization = () => {
    setIsPlaying(false);
    setIsComplete(true);
    setActiveIndices([]);
    setPivotIndex(null);
    setMessage("Visualization complete.");

    if (enableCaseDetection) {
      setDetectedCase(pendingCase);

      if (onCaseDetected) {
        onCaseDetected(pendingCase);
      }
    }
  };

  const generateNewArray = () => {
    const nextArray = generateRandomArray(DEFAULT_ARRAY_SIZE);
    setArray(nextArray);
    setOriginalArray(nextArray);
    setSteps([]);
    setOperationCounts({
      comparisons: 0,
      swaps: 0,
      totalSteps: 0,
      arraySize: nextArray.length,
    });
    resetPlaybackState();
  };

  const applyCustomArray = (values: number[]) => {
    setArray(values);
    setOriginalArray(values);
    setSteps([]);
    setOperationCounts({
      comparisons: 0,
      swaps: 0,
      totalSteps: 0,
      arraySize: values.length,
    });
    resetPlaybackState();
    setMessage(`Custom array applied. Ready to start ${title}.`);
  };

  const startVisualization = () => {
    const result = generateSteps(originalArray);

    if (enableCaseDetection) {
      const detected = classifyCase(originalArray);
      setPendingCase(detected);
      setDetectedCase(null);
    } else {
      setPendingCase(null);
      setDetectedCase(null);
      if (onCaseDetected) {
        onCaseDetected(null);
      }
    }

    setOperationCounts(getOperationCounts(result.steps, originalArray.length));
    setArray([...originalArray]);
    setSteps(result.steps);
    setCurrentStepIndex(0);
    setActiveIndices([]);
    setSortedIndices([]);
    setPivotIndex(null);
    setActiveLine(null);
    setIsComplete(false);
    setMessage(`Starting ${title}...`);
    setIsPlaying(true);

    if (onCaseDetected) {
      onCaseDetected(null);
    }
  };

  const resetVisualization = () => {
    setArray([...originalArray]);
    setSteps([]);
    setOperationCounts({
      comparisons: 0,
      swaps: 0,
      totalSteps: 0,
      arraySize: originalArray.length,
    });
    resetPlaybackState();
  };

  const pauseVisualization = () => {
    setIsPlaying(false);
  };

  const resumeVisualization = () => {
    if (steps.length === 0 || currentStepIndex >= steps.length) return;
    setIsPlaying(true);
  };

  const processStep = (step: AnimationStep) => {
    if (step.type === "compare") {
      setActiveIndices(step.indices);
    }

    if (step.type === "swap") {
      setArray((prev) => applySwap(prev, step.indices[0], step.indices[1]));
      setActiveIndices(step.indices);
    }

    if (step.type === "markSorted") {
      setSortedIndices((prev) => {
        if (prev.includes(step.index)) return prev;
        return [...prev, step.index];
      });
    }

    if (step.type === "pivot") {
      setPivotIndex(step.index);
    }

    if (step.type === "line") {
      setActiveLine(step.line);
    }

    if (step.type === "message") {
      setMessage(step.text);
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
  }, [currentStepIndex, isPlaying, speed, steps]);

  return (
    <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              {title} Visualization
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Step-based animation using generated algorithm events.
            </p>
          </div>

          <ControlsPanel
            speed={speed}
            onSpeedChange={setSpeed}
            onGenerateNewArray={generateNewArray}
            onStart={startVisualization}
            onPause={pauseVisualization}
            onResume={resumeVisualization}
            onStep={stepForward}
            onReset={resetVisualization}
            onApplyCustomArray={applyCustomArray}
          />

          <BarsChart
            array={array}
            activeIndices={activeIndices}
            sortedIndices={sortedIndices}
            pivotIndex={pivotIndex}
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
          <h3 className="text-lg font-semibold text-white">
            Operation Metrics
          </h3>

          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-4">
              <span>Comparisons</span>
              <span className="font-semibold text-white">
                {operationCounts.comparisons}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Swaps</span>
              <span className="font-semibold text-white">
                {operationCounts.swaps}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Total Steps</span>
              <span className="font-semibold text-white">
                {operationCounts.totalSteps}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Array Size</span>
              <span className="font-semibold text-white">
                {operationCounts.arraySize}
              </span>
            </div>
          </div>
        </aside>

        {enableCaseDetection && (
          <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold text-white">
              Detected Input Case
            </h3>
            <p className="mt-3 text-sm text-slate-300">
              {isComplete
                ? detectedCase === "best"
                  ? "Best Case"
                  : detectedCase === "worst"
                    ? "Worst Case"
                    : "Average Case"
                : "Run the visualization to classify the input."}
            </p>
          </aside>
        )}

        <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Legend</h3>

          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-slate-500" />
              <span>Default</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-amber-400" />
              <span>Comparing / swapping</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-violet-500" />
              <span>Pivot</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-emerald-500" />
              <span>Sorted</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}