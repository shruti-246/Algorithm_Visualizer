import { useMemo, useState } from "react";
import type { TreeData, TreeNode } from "../../types/tree";

interface TreeViewProps {
  tree: TreeData;
  visitedNodes: string[];
  currentNodeId: string | null;
  activeEdge: { from: string; to: string } | null;
  traversalOrder: string[];
  showLayers?: boolean;
  isEditable?: boolean;
  onAddLeftChild?: (parentNodeId: string) => void;
  onAddRightChild?: (parentNodeId: string) => void;
  onEditNodeValue?: (nodeId: string) => void;
}

interface ContextMenuState {
  nodeId: string;
  x: number;
  y: number;
}

function getNodeById(tree: TreeData, nodeId: string): TreeNode | undefined {
  return tree.nodes.find((node) => node.id === nodeId);
}

export default function TreeView({
  tree,
  visitedNodes,
  currentNodeId,
  activeEdge,
  traversalOrder,
  showLayers = false,
  isEditable = false,
  onAddLeftChild,
  onAddRightChild,
  onEditNodeValue,
}: TreeViewProps) {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const visitedSet = useMemo(() => new Set(visitedNodes), [visitedNodes]);

  const edges = useMemo(() => {
    return tree.nodes.flatMap((node) => {
      const nextEdges: Array<{ from: string; to: string }> = [];

      if (node.leftChildId) {
        nextEdges.push({ from: node.id, to: node.leftChildId });
      }

      if (node.rightChildId) {
        nextEdges.push({ from: node.id, to: node.rightChildId });
      }

      return nextEdges;
    });
  }, [tree.nodes]);

  const layerGroups = useMemo(() => {
    return tree.nodes.reduce<Record<number, number[]>>((acc, node) => {
      if (!acc[node.layer]) {
        acc[node.layer] = [];
      }

      acc[node.layer].push(node.y);
      return acc;
    }, {});
  }, [tree.nodes]);

  const orderedLayers = Object.keys(layerGroups)
    .map(Number)
    .sort((a, b) => a - b);

  const handleNodeContextMenu = (
    event: React.MouseEvent<SVGGElement>,
    nodeId: string,
  ) => {
    if (!isEditable) {
      return;
    }

    event.preventDefault();
    setContextMenu({
      nodeId,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const selectedNode = contextMenu
    ? getNodeById(tree, contextMenu.nodeId)
    : undefined;

  return (
    <div
      className="relative rounded-2xl border border-slate-800 bg-slate-950/50 p-6"
      onClick={closeContextMenu}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Tree Visualization</h3>
          <p className="mt-1 text-sm text-slate-300">
            Build a binary tree, then visualize traversal directly on it.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-300">
          Traversal Order:{" "}
          <span className="font-semibold text-cyan-300">
            {traversalOrder.length > 0 ? traversalOrder.join(" → ") : "—"}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 700 460"
          className="h-[460px] w-full rounded-xl border border-slate-800 bg-slate-950"
        >
          {showLayers &&
            orderedLayers.map((layer) => {
              const yValues = layerGroups[layer];
              const minY = Math.min(...yValues) - 35;
              const boxHeight = 90;

              return (
                <g key={`layer-${layer}`}>
                  <rect
                    x={20}
                    y={minY}
                    width={660}
                    height={boxHeight}
                    rx={12}
                    fill="transparent"
                    stroke="rgb(51 65 85)"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                    opacity="0.5"
                  />
                  <text
                    x={38}
                    y={minY + 50}
                    fill="rgb(226 232 240)"
                    fontSize="16"
                    fontWeight="600"
                  >
                    {`Layer ${layer}`}
                  </text>
                </g>
              );
            })}

          {edges.map((edge) => {
            const fromNode = getNodeById(tree, edge.from);
            const toNode = getNodeById(tree, edge.to);

            if (!fromNode || !toNode) {
              return null;
            }

            const isActive =
              activeEdge?.from === edge.from && activeEdge?.to === edge.to;

            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={isActive ? "rgb(34 211 238)" : "rgb(100 116 139)"}
                strokeWidth={isActive ? 4 : 2}
                strokeLinecap="round"
                opacity={isActive ? 1 : 0.85}
              />
            );
          })}

          {tree.nodes.map((node) => {
            const isVisited = visitedSet.has(node.id);
            const isCurrent = currentNodeId === node.id;
            const isRoot = tree.rootNodeId === node.id;

            let fill = "rgb(51 65 85)";
            let stroke = "rgb(148 163 184)";
            let textFill = "rgb(226 232 240)";

            if (isVisited) {
              fill = "rgb(16 185 129)";
              stroke = "rgb(52 211 153)";
              textFill = "rgb(240 253 250)";
            }

            if (isCurrent) {
              fill = "rgb(245 158 11)";
              stroke = "rgb(251 191 36)";
              textFill = "rgb(255 251 235)";
            }

            return (
              <g
                key={node.id}
                onContextMenu={(event) => handleNodeContextMenu(event, node.id)}
                style={{ cursor: isEditable ? "context-menu" : "default" }}
              >
                {isRoot && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={30}
                    fill="transparent"
                    stroke="rgb(168 85 247)"
                    strokeWidth="3"
                    opacity="0.9"
                  />
                )}

                <circle
                  cx={node.x}
                  cy={node.y}
                  r={24}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="2.5"
                />

                <text
                  x={node.x}
                  y={node.y + 6}
                  textAnchor="middle"
                  fill={textFill}
                  fontSize="20"
                  fontWeight="700"
                >
                  {node.value}
                </text>
              </g>
            );
          })}

          {tree.nodes
            .filter((node) => node.id === tree.rootNodeId)
            .map((node) => (
              <text
                key="root-label"
                x={node.x + 38}
                y={node.y - 6}
                fill="rgb(226 232 240)"
                fontSize="14"
                fontWeight="600"
              >
                Root Node
              </text>
            ))}
        </svg>
      </div>

      {contextMenu && selectedNode && (
        <div
          className="fixed z-50 min-w-[180px] rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="border-b border-slate-700 px-3 py-2 text-sm font-medium text-slate-200">
            Node: {selectedNode.value}
          </div>

          <button
            type="button"
            onClick={() => {
              onEditNodeValue?.(selectedNode.id);
              closeContextMenu();
            }}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
          >
            Edit Value
          </button>

          <button
            type="button"
            disabled={!!selectedNode.leftChildId}
            onClick={() => {
              onAddLeftChild?.(selectedNode.id);
              closeContextMenu();
            }}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add Left Child
          </button>

          <button
            type="button"
            disabled={!!selectedNode.rightChildId}
            onClick={() => {
              onAddRightChild?.(selectedNode.id);
              closeContextMenu();
            }}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add Right Child
          </button>
        </div>
      )}
    </div>
  );
}