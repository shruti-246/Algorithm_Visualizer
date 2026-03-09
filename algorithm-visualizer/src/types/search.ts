export type SearchStep =
  | { type: "line"; line: number }
  | { type: "message"; text: string }
  | { type: "check"; index: number }
  | { type: "found"; index: number }
  | { type: "notFound" }
  | { type: "setRange"; left: number; right: number }
  | { type: "setMid"; index: number };

export interface SearchRunResult {
  steps: SearchStep[];
  foundIndex: number;
}