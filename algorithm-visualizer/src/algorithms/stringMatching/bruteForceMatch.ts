import type {
  StringMatchRunResult,
  StringMatchStep,
} from "../../types/stringMatch";

export function bruteForceMatchSteps(
  text: string,
  pattern: string,
): StringMatchRunResult {
  const steps: StringMatchStep[] = [];

  const n = text.length;
  const m = pattern.length;

  for (let i = 0; i <= n - m; i++) {
    steps.push({ type: "line", line: 1 });
    steps.push({ type: "align", position: i });
    steps.push({
      type: "message",
      text: `Align pattern starting at index ${i}`,
    });

    let matched = true;

    for (let j = 0; j < m; j++) {
      steps.push({ type: "line", line: 2 });

      steps.push({
        type: "compare",
        textIndex: i + j,
        patternIndex: j,
      });

      if (text[i + j] === pattern[j]) {
        steps.push({
          type: "match",
          textIndex: i + j,
          patternIndex: j,
        });

        steps.push({
          type: "message",
          text: `Match '${pattern[j]}'`,
        });
      } else {
        steps.push({
          type: "mismatch",
          textIndex: i + j,
          patternIndex: j,
        });

        steps.push({
          type: "message",
          text: `Mismatch '${text[i + j]}' vs '${pattern[j]}'`,
        });

        matched = false;
        break;
      }
    }

    if (matched) {
      steps.push({ type: "line", line: 3 });
      steps.push({ type: "found", position: i });

      steps.push({
        type: "message",
        text: `Pattern found at index ${i}`,
      });

      return {
        steps,
        matchIndex: i,
      };
    }

    if (i < n - m) {
      steps.push({
        type: "shift",
        from: i,
        to: i + 1,
      });

      steps.push({
        type: "message",
        text: "Shift pattern one position to the right",
      });
    }
  }

  steps.push({
    type: "message",
    text: "Pattern not found",
  });

  return {
    steps,
    matchIndex: -1,
  };
}