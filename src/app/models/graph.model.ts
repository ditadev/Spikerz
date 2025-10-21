export interface GraphNode {
    id: string;
    label: string;
    value: number;
    x?: number;
    y?: number;
    color?: string;
  }
  
  export interface GraphEdge {
    source: string;
    target: string;
    value?: number;
  }
  
  export interface GraphData {
    nodes: GraphNode[];
    edges: GraphEdge[];
  }
  
  export interface PopoverData {
    node: GraphNode;
    position: { x: number; y: number };
  }