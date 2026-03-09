import type {
  StringMatchRunResult,
  StringMatchStep,
} from "../../types/stringMatch";

function buildShiftTable(pattern: string): Record<string, number> {
  const table: Record<string, number> = {};
  const m = pattern.length;

  for (let index = 0; index < m - 1; index += 1) {
    table[pattern[index]] = m - 1 - index;
  }

  return table;
}

export function horspoolSteps(
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

  const shiftTable = buildShiftTable(pattern);
  let alignment = 0;

  steps.push({ type: "line", line: 1 });
  steps.push({
    type: "message",
    text: "Built shift table for pattern",
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

        const shiftChar = text[alignment + m - 1];
        const shiftValue = shiftTable[shiftChar] ?? m;

        steps.push({
          type: "message",
          text: `Mismatch '${text[textIndex]}' vs '${pattern[patternIndex]}'. Character '${shiftChar}' gives shift ${shiftValue}`,
        });

        const nextAlignment = alignment + shiftValue;

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