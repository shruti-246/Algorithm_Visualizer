import type {
  StringMatchRunResult,
  StringMatchStep,
} from "../../types/stringMatch";

function buildLastOccurrenceTable(pattern: string): Record<string, number> {
  const table: Record<string, number> = {};

  for (let index = 0; index < pattern.length; index += 1) {
    table[pattern[index]] = index;
  }

  return table;
}

export function boyerMooreSteps(
  text: string,
  pattern: string,
): StringMatchRunResult {
  const steps: StringMatchStep[] = [];

  const n = text.length;
  const m = pattern.length;

  if (m === 0 || m > n) {
    steps.push({
      type: "message",
      text: "Pattern not found",
    });

    return {
      steps,
      matchIndex: -1,
    };
  }

  const lastOccurrence = buildLastOccurrenceTable(pattern);
  let alignment = 0;

  steps.push({ type: "line", line: 1 });
  steps.push({
    type: "message",
    text: "Built last-occurrence table for pattern",
  });

  while (alignment <= n - m) {
    steps.push({ type: "line", line: 2 });
    steps.push({ type: "align", position: alignment });
    steps.push({
      type: "message",
      text: `Align pattern at index ${alignment}`,
    });

    let patternIndex = m - 1;

    steps.push({ type: "line", line: 3 });

    while (patternIndex >= 0) {
      const textIndex = alignment + patternIndex;

      steps.push({ type: "line", line: 4 });
      steps.push({
        type: "compare",
        textIndex,
        patternIndex,
      });

      if (text[textIndex] === pattern[patternIndex]) {
        steps.push({ type: "line", line: 5 });
        steps.push({
          type: "match",
          textIndex,
          patternIndex,
        });

        steps.push({
          type: "message",
          text: `Match '${pattern[patternIndex]}' at text index ${textIndex}`,
        });

        patternIndex -= 1;
      } else {
        steps.push({ type: "line", line: 6 });
        steps.push({
          type: "mismatch",
          textIndex,
          patternIndex,
        });

        const mismatchedChar = text[textIndex];
        const lastSeen = lastOccurrence[mismatchedChar] ?? -1;
        const shiftValue = Math.max(1, patternIndex - lastSeen);
        const nextAlignment = alignment + shiftValue;

        steps.push({
          type: "message",
          text: `Mismatch '${mismatchedChar}' vs '${pattern[patternIndex]}'. Last occurrence is ${lastSeen}. Shift by ${shiftValue}`,
        });

        if (nextAlignment <= n - m) {
          steps.push({ type: "line", line: 7 });
          steps.push({
            type: "shift",
            from: alignment,
            to: nextAlignment,
          });

          steps.push({
            type: "message",
            text: `Shift pattern from ${alignment} to ${nextAlignment}`,
          });
        }

        alignment = nextAlignment;
        break;
      }
    }

    if (patternIndex < 0) {
      steps.push({ type: "line", line: 8 });
      steps.push({
        type: "found",
        position: alignment,
      });

      steps.push({
        type: "message",
        text: `Pattern found at index ${alignment}`,
      });

      return {
        steps,
        matchIndex: alignment,
      };
    }
  }

  steps.push({ type: "line", line: 9 });
  steps.push({
    type: "message",
    text: "Pattern not found",
  });

  return {
    steps,
    matchIndex: -1,
  };
}