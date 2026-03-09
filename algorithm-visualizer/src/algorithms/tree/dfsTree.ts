import type { TreeData, TreeNode, TreeStep, TreeRunResult } from "../../types/tree";

function getNode(tree: TreeData, id: string): TreeNode | undefined {
  return tree.nodes.find((node) => node.id === id);
}

export function dfsTreeSteps(tree: TreeData): TreeRunResult {
  const steps: TreeStep[] = [];
  const traversalOrder: string[] = [];
  const visited = new Set<string>();

  function dfs(nodeId: string) {
    const node = getNode(tree, nodeId);
    if (!node) return;

    steps.push({ type: "line", line: 1 });
    steps.push({ type: "push", nodeId });
    steps.push({ type: "setCurrent", nodeId });
    steps.push({
      type: "message",
      text: `Push node ${node.value} onto the stack`,
    });

    if (visited.has(nodeId)) {
      steps.push({ type: "line", line: 8 });
      steps.push({ type: "pop", nodeId });
      steps.push({
        type: "message",
        text: `Node ${node.value} already visited, pop and skip`,
      });
      return;
    }

    steps.push({ type: "line", line: 2 });
    steps.push({ type: "visit", nodeId });
    steps.push({
      type: "message",
      text: `Visit node ${node.value}`,
    });

    visited.add(nodeId);
    traversalOrder.push(node.value);

    if (node.leftChildId) {
      const leftNode = getNode(tree, node.leftChildId);

      steps.push({ type: "line", line: 4 });
      steps.push({
        type: "setActiveEdge",
        from: nodeId,
        to: node.leftChildId,
      });

      steps.push({
        type: "message",
        text: `Traverse left child ${leftNode?.value ?? node.leftChildId}`,
      });

      dfs(node.leftChildId);

      steps.push({ type: "clearActiveEdge" });
    }

    if (node.rightChildId) {
      const rightNode = getNode(tree, node.rightChildId);

      steps.push({ type: "line", line: 5 });
      steps.push({
        type: "setActiveEdge",
        from: nodeId,
        to: node.rightChildId,
      });

      steps.push({
        type: "message",
        text: `Traverse right child ${rightNode?.value ?? node.rightChildId}`,
      });

      dfs(node.rightChildId);

      steps.push({ type: "clearActiveEdge" });
    }

    steps.push({ type: "line", line: 6 });
    steps.push({ type: "pop", nodeId });
    steps.push({
      type: "message",
      text: `Backtrack from node ${node.value}`,
    });
  }

  dfs(tree.rootNodeId);

  steps.push({ type: "line", line: 9 });
  steps.push({
    type: "message",
    text: "DFS traversal complete",
  });

  return {
    steps,
    traversalOrder,
  };
}