import { useEffect, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  Position,
  useNodesState,
  useEdgesState,
  Handle,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';

export type GraphNode = { id: string; group?: 'connected' | 'orphan' };

export type TreeData = {
  root: string;
  tree: Record<string, string[]>;
  nodes: GraphNode[];
  edges: { source: string; target: string }[];
};

const NODE_W = 178;
const NODE_H = 40;
const ORPHAN_COLS = 6;
const ORPHAN_X_GAP = 200;
const ORPHAN_Y_GAP = 60;

// ─── Dagre layout for connected tree ─────────────────────────────────────────
const layoutConnected = (nodes: Node[], edges: Edge[]) => {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 70, marginx: 40, marginy: 40 });

  nodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return nodes.map((n) => {
    const pos = g.node(n.id);
    return {
      ...n,
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
      position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 },
    };
  });
};

// ─── Custom Node ──────────────────────────────────────────────────────────────
const FileNode = ({ data }: { data: any }) => (
  <>
    <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
    <div
      style={{ width: NODE_W }}
      title={data.fullPath}
      className={[
        'px-3 py-2 text-xs font-mono border rounded-lg truncate text-center transition-all select-none',
        data.isRoot
          ? 'bg-primary/20 border-primary text-primary font-bold shadow-[0_0_14px_rgba(34,197,94,0.3)]'
          : data.isOrphan
          ? 'bg-background border-border/40 text-muted-foreground/60 italic'
          : 'bg-card border-border text-foreground',
      ].join(' ')}
    >
      {data.name}
    </div>
    <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
  </>
);

const nodeTypes = { file: FileNode };

const BASE_EDGE = { stroke: '#374151', strokeWidth: 1.5 };
const BASE_MARKER = { type: MarkerType.ArrowClosed, color: '#374151', width: 14, height: 14 };

// ─── Main Component ───────────────────────────────────────────────────────────
export const DependencyTree = ({ data }: { data: TreeData }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!data || data.nodes.length === 0) return;

    // Split connected vs orphan
    const connectedIds = new Set(
      data.nodes.filter((n) => n.group !== 'orphan').map((n) => n.id)
    );
    const orphanNodes = data.nodes.filter((n) => n.group === 'orphan');

    // Build connected RF nodes
    const connRFNodes: Node[] = data.nodes
      .filter((n) => connectedIds.has(n.id))
      .map((n) => ({
        id: n.id,
        type: 'file',
        position: { x: 0, y: 0 },
        data: { name: n.id.split('/').pop() ?? n.id, fullPath: n.id, isRoot: n.id === data.root, isOrphan: false },
      }));

    const rfEdges: Edge[] = data.edges.map((e) => ({
      id: `${e.source}→${e.target}`,
      source: e.source,
      target: e.target,
      type: 'smoothstep',
      style: BASE_EDGE,
      markerEnd: BASE_MARKER,
    }));

    // Run dagre on connected nodes
    const layoutedConnected = layoutConnected(connRFNodes, rfEdges);

    // Find max Y of the connected tree to position orphans below
    const maxY = layoutedConnected.reduce(
      (max, n) => Math.max(max, n.position.y + NODE_H),
      0
    );
    const orphanStartY = maxY + 120; // 120px gap between tree and orphan grid

    // Layout orphans in a grid
    const orphanRFNodes: Node[] = orphanNodes.map((n, i) => ({
      id: n.id,
      type: 'file',
      position: {
        x: (i % ORPHAN_COLS) * ORPHAN_X_GAP,
        y: orphanStartY + Math.floor(i / ORPHAN_COLS) * ORPHAN_Y_GAP,
      },
      data: { name: n.id.split('/').pop() ?? n.id, fullPath: n.id, isRoot: false, isOrphan: true },
    }));

    setNodes([...layoutedConnected, ...orphanRFNodes]);
    setEdges(rfEdges);
  }, [data, setNodes, setEdges]);

  // Click node → highlight its subtree
  const onNodeClick = useCallback(
    (_: any, node: Node) => {
      const subtreeNodes = new Set<string>();
      const subtreeEdgeIds = new Set<string>();

      const collect = (id: string) => {
        if (subtreeNodes.has(id)) return;
        subtreeNodes.add(id);
        (data.tree[id] ?? []).forEach((child) => {
          subtreeEdgeIds.add(`${id}→${child}`);
          collect(child);
        });
      };
      collect(node.id);

      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          style: { opacity: subtreeNodes.has(n.id) ? 1 : 0.15 },
        }))
      );
      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          animated: subtreeEdgeIds.has(e.id),
          style: {
            stroke: subtreeEdgeIds.has(e.id) ? '#22c55e' : '#111827',
            strokeWidth: subtreeEdgeIds.has(e.id) ? 2 : 1,
            opacity: subtreeEdgeIds.has(e.id) ? 1 : 0.08,
          },
          markerEnd: {
            ...BASE_MARKER,
            color: subtreeEdgeIds.has(e.id) ? '#22c55e' : '#111827',
          },
        }))
      );
    },
    [data.tree, setNodes, setEdges]
  );

  const onPaneClick = useCallback(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, style: { opacity: 1 } })));
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        animated: false,
        style: BASE_EDGE,
        markerEnd: BASE_MARKER,
      }))
    );
  }, [setNodes, setEdges]);

  const connectedCount = data.nodes.filter((n) => n.group !== 'orphan').length;
  const orphanCount = data.nodes.filter((n) => n.group === 'orphan').length;

  if (!data || data.nodes.length === 0) {
    return (
      <div className="w-full h-[540px] flex items-center justify-center text-muted-foreground font-mono text-sm">
        No import relationships detected.
      </div>
    );
  }

  return (
    <div className="w-full h-[540px] relative rounded-b-2xl overflow-hidden">
      {/* Legend */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-3 px-3 py-1.5 bg-background/80 rounded-md border border-border text-xs font-mono text-muted-foreground backdrop-blur-md pointer-events-none">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Root
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-card border border-border inline-block" /> 
          Linked <span className="text-primary font-bold">({connectedCount})</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-background border border-border/40 inline-block" />
          Standalone <span className="text-muted-foreground/60">({orphanCount})</span>
        </span>
        <span className="text-muted-foreground/50">· Click to highlight subtree</span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.05}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={0.5} color="#1f2937" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
};
