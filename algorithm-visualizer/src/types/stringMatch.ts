export type StringMatchStep =
  | { type: "line"; line: number }
  | { type: "message"; text: string }
  | { type: "align"; position: number }
  | { type: "compare"; textIndex: number; patternIndex: number }
  | { type: "match"; textIndex: number; patternIndex: number }
  | { type: "mismatch"; textIndex: number; patternIndex: number }
  | { type: "found"; position: number }
  | { type: "shift"; from: number; to: number };

export interface StringMatchRunResult {
  steps: StringMatchStep[];
  matchIndex: number;
}