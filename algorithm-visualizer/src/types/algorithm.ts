export type AlgorithmCategory =
  | "sorting"
  | "searching"
  | "graph"
  | "string-matching";

export interface Algorithm {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;

  complexity: {
    best?: string;
    average?: string;
    worst?: string;
    space?: string;
  };
}