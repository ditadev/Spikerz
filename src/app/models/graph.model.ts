export interface GraphNode {
    id: string;
    label: string;
    sublabel?: string;
    value: number;
    x?: number;
    y?: number;
    color?: string;
    icon?: string;
    badge?: number;
    status?: 'critical' | 'warning' | 'success' | 'info';
  }
  
  export interface GraphEdge {
    source: string;
    target: string;
    value?: number;
    animated?: boolean;
  }
  
  export interface GraphData {
    nodes: GraphNode[];
    edges: GraphEdge[];
  }
  
  export interface Asset {
    id: string;
    name: string;
    ipAddress: string;
    riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  }
  
  export interface NodeDetails {
    title: string;
    description: string;
    assets: Asset[];
    metadata: {
      date: string;
      type: string;
      status: string;
      verified: boolean;
    };
    riskSummary: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
  }
  
  export interface PopoverData {
    node: GraphNode;
    details: NodeDetails;
    position: { x: number; y: number };
  }