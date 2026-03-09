import { useEffect, useRef, useState } from "react";
import PseudocodePanel from "../panels/PseudocodePanel";
import TreeControlsPanel from "../controls/TreeControlsPanel";
import TreeView from "../views/TreeView";
import type { TreeData, TreeNode, TreeRunResult, TreeStep } from "../../types/tree";

type AlgorithmCase = "best" | "average" | "worst" | null;

interface TreeVisualizerProps {
  title: string;
  pseudocodeLines: string[];
  tree: TreeData;
  generateSteps: (tree: TreeData) => TreeRunResult;
  traversalType: "bfs" | "dfs";
  onCaseDetected?: (value: AlgorithmCase) => void;
}

interface TreeMetrics {
  visitedCount: number;
  //totalSteps: number;
  nodeCount: number;
  edgeCount: number;
}

function cloneTree(tree: TreeData): TreeData {
  return {
    rootNodeId: tree.rootNodeId,
    nodes: tree.nodes.map((node) => ({ ...node })),
  };
}

function getNodeById(tree: TreeData, nodeId: string): TreeNode | undefined {
  return tree.nodes.find((node) => node.id === nodeId);
}

function countEdges(tree: TreeData) {
  return tree.nodes.reduce((count, node) => {
    let total = count;
    if (node.leftChildId) total += 1;
    if (node.rightChildId) total += 1;
    return total;
  }, 0);
}

function getTreeMetrics(tree: TreeData, steps: TreeStep[]): TreeMetrics {
  return {
    visitedCount: steps.filter((step) => step.type === "visit").length,
    //totalSteps: steps.length,
    nodeCount: tree.nodes.length,
    edgeCount: countEdges(tree),
  };
}

function calculateChildPosition(parent: TreeNode, side: "left" | "right") {
  const layerSpacing = 120;
  const baseOffset = 180;
  const shrinkPerLayer = 0.6;
  const offset = Math.max(50, Math.round(baseOffset * Math.pow(shrinkPerLayer, parent.layer)));

  return {
    x: side === "left" ? parent.x - offset : parent.x + offset,
    y: parent.y + layerSpacing,
    layer: parent.layer + 1,
  };
}

function classifyTreeTraversalCase(tree: TreeData): AlgorithmCase {
  const nodeCount = tree.nodes.length;

  if (nodeCount <= 1) {
    return "best";
  }

  if (nodeCount <= 4) {
    return "average";
  }

  return "worst";
}

export default function TreeVisualizer({
  title,
  pseudocodeLines,
  tree,
  generateSteps,
  traversalType,
  onCaseDetected,
}: TreeVisualizerProps) {
  const [treeState, setTreeState] = useState<TreeData>(() => cloneTree(tree));
  const [steps, setSteps] = useState<TreeStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [activeEdge, setActiveEdge] = useState<{ from: string; to: string } | null>(
    null,
  );
  const [queueOrStack, setQueueOrStack] = useState<string[]>([]);
  const [traversalOrder, setTraversalOrder] = useState<string[]>([]);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [message, setMessage] = useState(
    "Build your tree, then start the traversal.",
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [metrics, setMetrics] = useState<TreeMetrics>({
    visitedCount: 0,
    //totalSteps: 0,
    nodeCount: tree.nodes.length,
    edgeCount: countEdges(tree),
  });
  const [detectedCase, setDetectedCase] = useState<AlgorithmCase>(null);
  const [pendingCase, setPendingCase] = useState<AlgorithmCase>(null);

  const timeoutRef = useRef<number | null>(null);

  const resetTraversalState = () => {
    setCurrentStepIndex(0);
    setVisitedNodes([]);
    setCurrentNodeId(null);
    setActiveEdge(null);
    setQueueOrStack([]);
    setTraversalOrder([]);
    setActiveLine(null);
    setIsPlaying(false);
    setDetectedCase(null);
    setPendingCase(null);
    setMessage(`Ready to start ${title}.`);
    setMetrics({
      visitedCount: 0,
      //totalSteps: 0,
      nodeCount: treeState.nodes.length,
      edgeCount: countEdges(treeState),
    });

    if (onCaseDetected) {
      onCaseDetected(null);
    }
  };

  const resetTree = () => {
    const freshTree = cloneTree(tree);
    setTreeState(freshTree);
    setSteps([]);
    setCurrentStepIndex(0);
    setVisitedNodes([]);
    setCurrentNodeId(null);
    setActiveEdge(null);
    setQueueOrStack([]);
    setTraversalOrder([]);
    setActiveLine(null);
    setIsPlaying(false);
    setDetectedCase(null);
    setPendingCase(null);
    setMessage("Tree reset to the initial root node.");
    setMetrics({
      visitedCount: 0,
      //totalSteps: 0,
      nodeCount: freshTree.nodes.length,
      edgeCount: countEdges(freshTree),
    });

    if (onCaseDetected) {
      onCaseDetected(null);
    }
  };

  const addChild = (parentNodeId: string, side: "left" | "right") => {
    if (isPlaying) return;

    const value = window.prompt(`Enter value for the ${side} child:`);
    if (!value || value.trim().length === 0) return;

    const trimmedValue = value.trim();

    setTreeState((prevTree) => {
      const nextTree = cloneTree(prevTree);
      const parentNode = getNodeById(nextTree, parentNodeId);

      if (!parentNode) {
        return prevTree;
      }

      const existingNode = nextTree.nodes.find((node) => node.id === trimmedValue);
      if (existingNode) {
        window.alert("A node with that value already exists. Use a unique value.");
        return prevTree;
      }

      if (side === "left" && parentNode.leftChildId) {
        window.alert("This node already has a left child.");
        return prevTree;
      }

      if (side === "right" && parentNode.rightChildId) {
        window.alert("This node already has a right child.");
        return prevTree;
      }

      const position = calculateChildPosition(parentNode, side);

      nextTree.nodes.push({
        id: trimmedValue,
        value: trimmedValue,
        x: position.x,
        y: position.y,
        layer: position.layer,
        leftChildId: null,
        rightChildId: null,
        parentId: parentNodeId,
      });

      if (side === "left") {
        parentNode.leftChildId = trimmedValue;
      } else {
        parentNode.rightChildId = trimmedValue;
      }

      return nextTree;
    });

    setSteps([]);
    setCurrentStepIndex(0);
    setVisitedNodes([]);
    setCurrentNodeId(null);
    setActiveEdge(null);
    setQueueOrStack([]);
    setTraversalOrder([]);
    setActiveLine(null);
    setDetectedCase(null);
    setPendingCase(null);
    setMessage(`Added ${side} child ${trimmedValue} to node ${parentNodeId}.`);

    if (onCaseDetected) {
      onCaseDetected(null);
    }
  };

  const editNodeValue = (nodeId: string) => {
    if (isPlaying) return;

    const node = getNodeById(treeState, nodeId);
    if (!node) return;

    const nextValue = window.prompt("Edit node value:", node.value);
    if (!nextValue || nextValue.trim().length === 0) return;

    const trimmedValue = nextValue.trim();

    if (trimmedValue === node.id) return;

    const existingNode = treeState.nodes.find((item) => item.id === trimmedValue);
    if (existingNode) {
      window.alert("A node with that value already exists. Use a unique value.");
      return;
    }

    setTreeState((prevTree) => {
      const nextTree = cloneTree(prevTree);

      const targetNode = getNodeById(nextTree, nodeId);
      if (!targetNode) return prevTree;

      const oldId = targetNode.id;

      targetNode.id = trimmedValue;
      targetNode.value = trimmedValue;

      nextTree.nodes.forEach((item) => {
        if (item.leftChildId === oldId) item.leftChildId = trimmedValue;
        if (item.rightChildId === oldId) item.rightChildId = trimmedValue;
        if (item.parentId === oldId) item.parentId = trimmedValue;
      });

      if (nextTree.rootNodeId === oldId) {
        nextTree.rootNodeId = trimmedValue;
      }

      return nextTree;
    });

    setSteps([]);
    setCurrentStepIndex(0);
    setVisitedNodes([]);
    setCurrentNodeId(null);
    setActiveEdge(null);
    setQueueOrStack([]);
    setTraversalOrder([]);
    setActiveLine(null);
    setDetectedCase(null);
    setPendingCase(null);
    setMessage(`Updated node ${nodeId} to ${trimmedValue}.`);

    if (onCaseDetected) {
      onCaseDetected(null);
    }
  };

  const startVisualization = () => {
    const result = generateSteps(treeState);
    const nextCase = classifyTreeTraversalCase(treeState);

    setPendingCase(nextCase);
    setDetectedCase(null);

    if (onCaseDetected) {
      onCaseDetected(null);
    }

    setSteps(result.steps);
    setCurrentStepIndex(0);
    setVisitedNodes([]);
    setCurrentNodeId(null);
    setActiveEdge(null);
    setQueueOrStack([]);
    setTraversalOrder([]);
    setActiveLine(null);
    setMetrics(getTreeMetrics(treeState, result.steps));
    setMessage(`Starting ${title}...`);
    setIsPlaying(true);
  };

  const pauseVisualization = () => {
    setIsPlaying(false);
  };

  const resumeVisualization = () => {
    if (steps.length === 0 || currentStepIndex >= steps.length) return;
    setIsPlaying(true);
  };

  const processStep = (step: TreeStep) => {
    if (step.type === "line") {
      setActiveLine(step.line);
    }

    if (step.type === "message") {
      setMessage(step.text);
    }

    if (step.type === "setCurrent") {
      setCurrentNodeId(step.nodeId);
    }

    if (step.type === "visit") {
      setVisitedNodes((prev) => {
        if (prev.includes(step.nodeId)) return prev;
        return [...prev, step.nodeId];
      });

      setTraversalOrder((prev) => {
        if (prev.includes(step.nodeId)) return prev;
        return [...prev, step.nodeId];
      });
    }

    if (step.type === "setActiveEdge") {
      setActiveEdge({ from: step.from, to: step.to });
    }

    if (step.type === "clearActiveEdge") {
      setActiveEdge(null);
    }

    if (step.type === "enqueue" || step.type === "push") {
      setQueueOrStack((prev) => [...prev, step.nodeId]);
    }

    if (step.type === "dequeue" || step.type === "pop") {
      setQueueOrStack((prev) => {
        const next = [...prev];
        const index = next.indexOf(step.nodeId);
        if (index >= 0) {
          next.splice(index, 1);
        }
        return next;
      });
    }
  };

  const finishVisualization = () => {
    setIsPlaying(false);
    setActiveEdge(null);
    setActiveLine(null);
    setCurrentNodeId(null);
    setMessage("Traversal complete.");
    setDetectedCase(pendingCase);

    if (onCaseDetected) {
      onCaseDetected(pendingCase);
    }
  };

  const stepForward = () => {
    if (currentStepIndex >= steps.length) {
      finishVisualization();
      return;
    }

    const step = steps[currentStepIndex];
    processStep(step);

    const nextIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextIndex);

    if (nextIndex >= steps.length) {
      finishVisualization();
    }
  };

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStepIndex >= steps.length) {
      finishVisualization();
      return;
    }

    const step = steps[currentStepIndex];

    timeoutRef.current = window.setTimeout(() => {
      processStep(step);

      setCurrentStepIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= steps.length) {
          finishVisualization();
        }
        return nextIndex;
      });
    }, speed);

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [currentStepIndex, isPlaying, speed, steps, pendingCase]);

  return (
    <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              {title} Visualization
            </h2>

            <p className="mt-1 text-sm text-slate-300">
              Build a binary tree, then visualize traversal directly on it.
            </p>

            <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950/60 p-3 text-xs text-slate-300">
              <p className="font-semibold text-slate-200 mb-1">How to build the tree:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Right-click a node to add left or right children.</li>
                <li>Click a node to edit its value.</li>
                <li>Build your tree before starting BFS or DFS.</li>
              </ul>
            </div>
          </div>

          <TreeControlsPanel
            speed={speed}
            onSpeedChange={setSpeed}
            onStart={startVisualization}
            onPause={pauseVisualization}
            onResume={resumeVisualization}
            onStep={stepForward}
            onResetTraversal={resetTraversalState}
            onResetTree={resetTree}
          />

          <TreeView
            tree={treeState}
            visitedNodes={visitedNodes}
            currentNodeId={currentNodeId}
            activeEdge={activeEdge}
            traversalOrder={traversalOrder}
            showLayers
            isEditable={!isPlaying}
            onAddLeftChild={(nodeId) => addChild(nodeId, "left")}
            onAddRightChild={(nodeId) => addChild(nodeId, "right")}
            onEditNodeValue={editNodeValue}
          />
        </div>

        <PseudocodePanel
          title="Pseudocode"
          lines={pseudocodeLines}
          activeLine={activeLine}
        />
      </div>

      <div className="space-y-6">
        <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Current Status</h3>
          <p className="mt-3 text-sm text-slate-300">{message}</p>
        </aside>

        <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">
            {traversalType === "bfs" ? "Queue" : "Stack"}
          </h3>

          <div className="mt-4 min-h-[120px] space-y-2">
            {queueOrStack.length === 0 ? (
              <p className="text-sm text-slate-400">Empty</p>
            ) : (
              queueOrStack.map((nodeId, index) => (
                <div
                  key={`${nodeId}-${index}`}
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-200"
                >
                  {nodeId}
                </div>
              ))
            )}
          </div>
        </aside>

        <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Detected Input Case</h3>
          <p className="mt-3 text-sm text-slate-300">
            {detectedCase === null
              ? "Run the traversal to classify the current tree."
              : detectedCase === "best"
                ? "Best Case"
                : detectedCase === "worst"
                  ? "Worst Case"
                  : "Average Case"}
          </p>
        </aside>

        <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Traversal Metrics</h3>

          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-4">
              <span>Visited Nodes</span>
              <span className="font-semibold text-white">
                {traversalOrder.length}
              </span>
            </div>

            {/* <div className="flex items-center justify-between gap-4">
              <span>Total Steps</span>
              <span className="font-semibold text-white">
                {metrics.totalSteps}
              </span>
            </div> */}

            <div className="flex items-center justify-between gap-4">
              <span>Node Count</span>
              <span className="font-semibold text-white">
                {treeState.nodes.length}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Edge Count</span>
              <span className="font-semibold text-white">
                {countEdges(treeState)}
              </span>
            </div>
          </div>
        </aside>

        <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold text-white">Legend</h3>

          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-slate-600" />
              <span>Unvisited node</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-amber-400" />
              <span>Current node</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-emerald-500" />
              <span>Visited node</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded bg-cyan-400" />
              <span>Active traversal edge</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded border-2 border-violet-400" />
              <span>Root node</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}