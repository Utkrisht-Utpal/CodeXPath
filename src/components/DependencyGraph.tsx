import React, { useRef, useEffect, useState, useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";

export type GraphData = {
  nodes: { id: string }[];
  edges: { source: string; target: string }[];
};

export const DependencyGraph = ({ data }: { data: GraphData }) => {
  const fgRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverNode, setHoverNode] = useState<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: 400
      });
    }
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: 400
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pre-process links for highlighting logic
  const gData = useMemo(() => {
    const nodes = data.nodes.map(n => ({ id: n.id, neighbors: [] as any[], links: [] as any[] }));
    const links = data.edges.map(e => ({ source: e.source, target: e.target }));
    
    // Cross-link
    links.forEach(link => {
      const a = nodes.find(n => n.id === link.source);
      const b = nodes.find(n => n.id === link.target);
      if (a && b) {
        a.neighbors.push(b);
        b.neighbors.push(a);
        a.links.push(link);
        b.links.push(link);
      }
    });

    return { nodes, links };
  }, [data]);

  const handleNodeHover = (node: any) => {
    setHoverNode(node || null);
  };

  return (
    <div ref={containerRef} className="w-full h-[400px] border border-border rounded-2xl overflow-hidden bg-card/60 backdrop-blur-sm relative">
      <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-background/80 rounded-md border border-border text-xs font-mono text-muted-foreground backdrop-blur-md">
        Scroll to zoom. Drag to move.
      </div>
      {(dimensions.width > 0 && gData.nodes.length > 0) ? (
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={gData}
          nodeLabel="id"
          nodeColor={node => {
            if (!hoverNode) return '#22c55e';
            if (node === hoverNode) return '#4ade80';
            return hoverNode.neighbors?.includes(node) ? '#22c55e' : '#1f2937';
          }}
          nodeRelSize={6}
          linkColor={link => {
            if (!hoverNode) return '#1f2937'; // Subtle gray line
            return hoverNode.links?.includes(link) ? '#4ade80' : '#111827'; // Highlight links of hovered node
          }}
          linkWidth={link => (hoverNode && hoverNode.links?.includes(link) ? 2 : 1)}
          linkDirectionalParticles={4}
          linkDirectionalParticleWidth={link => (hoverNode && hoverNode.links?.includes(link) ? 4 : 0)}
          onNodeHover={handleNodeHover}
          backgroundColor="transparent"
        />
      ) : (
        <div className="w-full h-[400px] flex items-center justify-center text-muted-foreground font-mono text-sm">
          {data.nodes.length === 0 ? "No dependencies found" : "Loading graph..."}
        </div>
      )}
    </div>
  );
};
