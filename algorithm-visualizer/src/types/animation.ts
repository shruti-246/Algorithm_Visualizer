export type AnimationStep =
  | { type: "compare"; indices: [number, number] }
  | { type: "swap"; indices: [number, number] }
  | { type: "overwrite"; index: number; value: number }
  | { type: "markSorted"; index: number }
  | { type: "pivot"; index: number }
  | { type: "message"; text: string }
  | { type: "line"; line: number }
  | { type: "setRange"; start: number; end: number }
  | { type: "setLeftRange"; start: number; end: number }
  | { type: "setRightRange"; start: number; end: number };
    