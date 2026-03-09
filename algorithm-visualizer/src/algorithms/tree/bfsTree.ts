import type { TreeData, TreeRunResult, TreeStep } from "../../types/tree";

function getNodeById(tree: TreeData, nodeId: string) {
  return tree.nodes.find((node) => node.id === nodeId);
}

export function bfsTreeSteps(tree: TreeData): TreeRunResult {
  const steps: TreeStep[] = [];
  const traversalOrder: string[] = [];

  const visited = new Set<string>();
  const queue: string[] = [];

  const rootNodeId = tree.rootNodeId;

  const rootNode = getNodeById(tree, rootNodeId);
  if (!rootNode) {
    steps.push({
      type: "message",
      text: "Tree has no valid root node.",
    });

    return {
      steps,
      traversalOrder,
    };
  }

  steps.push({ type: "line", line: 1 });
  steps.push({
    type: "message",
    text: `Starting BFS from root node ${rootNode.value}`,
  });

  visited.add(rootNodeId);
  queue.push(rootNodeId);

  steps.push({ type: "line", line: 2 });
  steps.push({ type: "enqueue", nodeId: rootNodeId });
  steps.push({
    type: "message",
    text: `Enqueued root node ${rootNode.value}`,
  });

  while (queue.length > 0) {
    steps.push({ type: "line", line: 3 });

    const currentNodeId = queue.shift();

    if (!currentNodeId) {
      break;
    }

    const currentNode = getNodeById(tree, currentNodeId);
    if (!currentNode) {
      continue;
    }

    steps.push({ type: "dequeue", nodeId: currentNodeId });
    steps.push({ type: "setCurrent", nodeId: currentNodeId });
    steps.push({
      type: "message",
      text: `Dequeued node ${currentNode.value}`,
    });

    steps.push({ type: "line", line: 4 });
    steps.push({ type: "visit", nodeId: currentNodeId });

    traversalOrder.push(currentNode.value);

    steps.push({
      type: "message",
      text: `Visited node ${currentNode.value}`,
    });

    const children = [
      currentNode.leftChildId,
      currentNode.rightChildId,
    ].filter(Boolean) as string[];

    steps.push({ type: "line", line: 5 });

    for (const childId of children) {
      const childNode = getNodeById(tree, childId);
      if (!childNode) {
        continue;
      }

      steps.push({ type: "line", line: 6 });
      steps.push({
        type: "setActiveEdge",
        from: currentNodeId,
        to: childId,
      });

      steps.push({
        type: "message",
        text: `Checking child ${childNode.value} of node ${currentNode.value}`,
      });

      if (!visited.has(childId)) {
        steps.push({ type: "line", line: 7 });

        visited.add(childId);
        queue.push(childId);

        steps.push({ type: "enqueue", nodeId: childId });
        steps.push({
          type: "message",
          text: `Child ${childNode.value} not visited, enqueue it`,
        });
      } else {
        steps.push({ type: "line", line: 8 });
        steps.push({
          type: "message",
          text: `Child ${childNode.value} already visited, skip`,
        });
      }

      steps.push({ type: "clearActiveEdge" });
    }
  }

  steps.push({ type: "line", line: 9 });
  steps.push({
    type: "message",
    text: "BFS traversal complete",
  });

  return {
    steps,
    traversalOrder,
  };
}