export interface TreeNode {
  id: string;
  value: string;
  x: number;
  y: number;
  layer: number;
  leftChildId?: string | null;
  rightChildId?: string | null;
  parentId?: string | null;
}

export interface TreeEdge {
  from: string;
  to: string;
}

export interface TreeData {
  nodes: TreeNode[];
  rootNodeId: string;
}

export type TreeStep =
  | { type: "line"; line: number }
  | { type: "message"; text: string }
  | { type: "visit"; nodeId: string }
  | { type: "setCurrent"; nodeId: string }
  | { type: "enqueue"; nodeId: string }
  | { type: "dequeue"; nodeId: string }
  | { type: "push"; nodeId: string }
  | { type: "pop"; nodeId: string }
  | { type: "setActiveEdge"; from: string; to: string }
  | { type: "clearActiveEdge" };

export interface TreeRunResult {
  steps: TreeStep[];
  traversalOrder: string[];
}