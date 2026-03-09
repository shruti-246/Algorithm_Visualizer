import { useEffect, useRef, useState } from "react";
import PatternControlsPanel from "../controls/PatternControlsPanel";
import PseudocodePanel from "../panels/PseudocodePanel";
import PatternView from "../views/PatternView";
import type {
  StringMatchRunResult,
  StringMatchStep,
} from "../../types/stringMatch";

type AlgorithmCase = "best" | "average" | "worst" | null;

interface StringMatchingVisualizerProps {
  title: string;
  pseudocodeLines: string[];
  generateSteps: (text: string, pattern: string) => StringMatchRunResult;
  onCaseDetected?: (value: AlgorithmCase) => void;
}

interface StringMetrics {
  comparisons: number;
  shifts: number;
  textLength: number;
  patternLength: number;
  totalSteps: number;
}

function getStringMetrics(
  steps: StringMatchStep[],
  textLength: number,
  patternLength: number,
): StringMetrics {
  return {
    comparisons: steps.filter((step) => step.type === "compare").length,
    shifts: steps.filter((step) => step.type === "shift").length,
    textLength,
    patternLength,
    totalSteps: steps.length,
  };
}

function classifyBruteForceCase(
  result: StringMatchRunResult,
  text: string,
  pattern: string,
): AlgorithmCase {
  const lastPossibleAlignment = text.length - pattern.length;

  if (result.matchIndex === 0) {
    return "best";
  }

  if (
    result.matchIndex === -1 ||
    result.matchIndex === lastPossibleAlignment
  ) {
    return "worst";
  }

  return "average";
}

export default function StringMatchingVisualizer({
  title,
  pseudocodeLines,
  generateSteps,
  onCaseDetected,
}: StringMatchingVisualizerProps) {
  const [text, setText] = useState("THISISATEST");
  const [pattern, setPattern] = useState("TEST");
  const [originalText, setOriginalText] = useState("THISISATEST");
  const [originalPattern, setOriginalPattern] = useState("TEST");

  const [steps, setSteps] = useState<StringMatchStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [alignment, setAlignment] = useState(0);
  const [activeTextIndex, setActiveTextIndex] = useState<number | null>(null);
  const [activePatternIndex, setActivePatternIndex] = useState<number | null>(
    null,
  );
  const [matchedPairs, setMatchedPairs] = useState<
    Array<{ textIndex: number; patternIndex: number }>
  >([]);
  const [mismatchedPair, setMismatchedPair] = useState<{
    textIndex: number;
    patternIndex: number;
  } | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [message, setMessage] = useState(
    "Provide text and pattern, then start the visualization.",
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [metrics, setMetrics] = useState<StringMetrics>({
    comparisons: 0,
    shifts: 0,
    textLength: originalText.length,
    patternLength: originalPattern.length,
    totalSteps: 0,
  });
  const [detectedCase, setDetectedCase] = useState<AlgorithmCase>(null);
  const [pendingCase, setPendingCase] = useState<AlgorithmCase>(null);

  const timeoutRef = useRef<number | null>(null);

  const resetPlaybackState = () => {
    setCurrentStepIndex(0);
    setAlignment(0);
    setActiveTextIndex(null);
    setActivePatternIndex(null);
    setMatchedPairs([]);
    setMismatchedPair(null);
    setFoundIndex(null);
    setActiveLine(null);
    setIsPlaying(false);
    setDetectedCase(null);
    setPendingCase(null);
    setMessage(`Ready to start ${title}.`);
    setMetrics({
      comparisons: 0,
      shifts: 0,
      textLength: originalText.length,
      patternLength: originalPattern.length,
      totalSteps: 0,
    });

    if (onCaseDetected) {
      onCaseDetected(null);
    }
  };

  const generateExample = () => {
    const exampleText = "THISISATEST";
    const examplePattern = "TEST";

    setText(exampleText);
    setPattern(examplePattern);
    setOriginalText(exampleText);
    setOriginalPattern(examplePattern);
    setSteps([]);
    setMetrics({
      comparisons: 0,
      shifts: 0,
      textLength: exampleText.length,
      patternLength: examplePattern.length,
      totalSteps: 0,
    });
    resetPlaybackState();
    setMessage(`Example input loaded. Ready to start ${title}.`);
  };

  const applyInputs = (nextText: string, nextPattern: string) => {
    setText(nextText);
    setPattern(nextPattern);
    setOriginalText(nextText);
    setOriginalPattern(nextPattern);
    setSteps([]);
    setMetrics({
      comparisons: 0,
      shifts: 0,
      textLength: nextText.length,
      patternLength: nextPattern.length,
      totalSteps: 0,
    });
    resetPlaybackState();
    setMessage(`Custom input applied. Ready to start ${title}.`);
  };

  const startVisualization = () => {
    const result = generateSteps(originalText, originalPattern);
    const nextCase = classifyBruteForceCase(
      result,
      originalText,
      originalPattern,
    );

    setPendingCase(nextCase);
    setDetectedCase(null);

    if (onCaseDetected) {
      onCaseDetected(null);
    }

    setMetrics(
      getStringMetrics(result.steps, originalText.length, originalPattern.length),
    );
    setText(originalText);
    setPattern(originalPattern);
    setSteps(result.steps);
    setCurrentStepIndex(0);
    setAlignment(0);
    setActiveTextIndex(null);
    setActivePatternIndex(null);
    setMatchedPairs([]);
    setMismatchedPair(null);
    setFoundIndex(null);
    setActiveLine(null);
    setMessage(`Starting ${title}...`);
    setIsPlaying(true);
  };

  const resetVisualization = () => {
    setText(originalText);
    setPattern(originalPattern);
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

  const processStep = (step: StringMatchStep) => {
    if (step.type === "line") {
      setActiveLine(step.line);
    }

    if (step.type === "message") {
      setMessage(step.text);
    }

    if (step.type === "align") {
      setAlignment(step.position);
      setMatchedPairs([]);
      setMismatchedPair(null);
      setActiveTextIndex(null);
      setActivePatternIndex(null);
    }

    if (step.type === "compare") {
      setActiveTextIndex(step.textIndex);
      setActivePatternIndex(step.patternIndex);
    }

    if (step.type === "match") {
      setMatchedPairs((prev) => [
        ...prev,
        { textIndex: step.textIndex, patternIndex: step.patternIndex },
      ]);
    }

    if (step.type === "mismatch") {
      setMismatchedPair({
        textIndex: step.textIndex,
        patternIndex: step.patternIndex,
      });
    }

    if (step.type === "shift") {
      setAlignment(step.to);
      setMatchedPairs([]);
      setMismatchedPair(null);
      setActiveTextIndex(null);
      setActivePatternIndex(null);
    }

    if (step.type === "found") {
      setFoundIndex(step.position);
      setAlignment(step.position);
      setActiveTextIndex(null);
      setActivePatternIndex(null);
      setMismatchedPair(null);
    }
  };

  const finishVisualization = () => {
    setIsPlaying(false);
    setMessage("String matching complete.");
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
              Step-based pattern alignment and character comparison.
            </p>
          </div>

          <PatternControlsPanel
            text={text}
            pattern={pattern}
            speed={speed}
            onTextChange={setText}
            onPatternChange={setPattern}
            onSpeedChange={setSpeed}
            onGenerateExample={generateExample}
            onStart={startVisualization}
            onPause={pauseVisualization}
            onResume={resumeVisualization}
            onStep={stepForward}
            onReset={resetVisualization}
            onApplyInputs={applyInputs}
          />

          <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex flex-wrap gap-6 text-sm text-slate-300">
              <p>
                Text length:{" "}
                <span className="font-semibold text-cyan-300">
                  {originalText.length}
                </span>
              </p>
              <p>
                Pattern length:{" "}
                <span className="font-semibold text-cyan-300">
                  {originalPattern.length}
                </span>
              </p>
            </div>
          </div>

          <PatternView
            text={text}
            pattern={pattern}
            alignment={alignment}
            activeTextIndex={activeTextIndex}
            activePatternIndex={activePatternIndex}
            matchedPairs={matchedPairs}
            mismatchedPair={mismatchedPair}
            foundIndex={foundIndex}
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
          <h3 className="text-lg font-semibold text-white">Match Metrics</h3>

          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-4">
              <span>Comparisons</span>
              <span className="font-semibold text-white">
                {metrics.comparisons}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Shifts</span>
              <span className="font-semibold text-white">{metrics.shifts}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Total Steps</span>
              <span className="font-semibold text-white">
                {metrics.totalSteps}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Text Length</span>
              <span className="font-semibold text-white">
                {metrics.textLength}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Pattern Length</span>
              <span className="font-semibold text-white">
                {metrics.patternLength}
              </span>
            </div>
          </div>
        </aside>

        <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Detected Input Case</h3>
          <p className="mt-3 text-sm text-slate-300">
            {detectedCase === null
              ? "Run the visualization to classify the current match."
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
              <span className="h-4 w-4 rounded bg-cyan-500/25" />
              <span>Aligned pattern window</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-amber-500/60" />
              <span>Currently comparing</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-emerald-500/60" />
              <span>Matching characters</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-red-500/60" />
              <span>Mismatch</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}