import { Component, inject, signal, effect, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphDataService } from '../../services/graph-data.service';
import { GraphNode, GraphEdge } from '../../models/graph.model';
import { NodeTooltipComponent } from '../node-tooltip/node-tooltip';

export interface NodeTooltipData {
  type: 'email' | 'server' | 'branch-server';
  title?: string;
  serverName?: string;
  ipAddress?: string;
  documentTitle?: string;
  contentLines?: string[];
  gridNumbers?: string[];
  badges?: Array<{ color: string; text: string }>;
}

@Component({
  selector: 'app-graph-view',
  standalone: true,
  imports: [CommonModule, NodeTooltipComponent],
  templateUrl: './graph-view.html',
  styleUrls: ['./graph-view.scss']
})
export class GraphViewComponent {
  @ViewChild('svgCanvas', { static: false }) svgCanvas?: ElementRef<SVGSVGElement>;
  
  private readonly graphService: GraphDataService = inject(GraphDataService);
  
  nodes = signal<GraphNode[]>([]);
  edges = signal<GraphEdge[]>([]);
  hoveredNode = signal<{ node: GraphNode; data: NodeTooltipData; position: { x: number; y: number } } | null>(null);

  constructor() {
    effect(() => {
      const data = this.graphService.graphData();
      if (data) {
        const positionedNodes = this.layoutNodes(data.nodes);
        this.nodes.set(positionedNodes);
        this.edges.set(data.edges);
      }
    });
  }

  private layoutNodes(nodes: GraphNode[]): GraphNode[] {
    const centerY = 140; 
    const spacing = 150;
    const branchOffset = 90; 
    
    const positions = [
      { x: 100, y: centerY },
      { x: 100 + spacing, y: centerY },
      { x: 100 + spacing * 2, y: centerY },
      { x: 100 + spacing * 3, y: centerY - branchOffset },
      { x: 100 + spacing * 3, y: centerY + branchOffset }
    ];

    return nodes.map((node, index) => ({
      ...node,
      x: positions[index]?.x ?? 100 + (index * spacing),
      y: positions[index]?.y ?? centerY
    }));
  }

  getNodePosition(nodeId: string): { x: number; y: number } {
    const node = this.nodes().find(n => n.id === nodeId);
    return node ? { x: node.x ?? 0, y: node.y ?? 0 } : { x: 0, y: 0 };
  }

  getEdgePath(edge: GraphEdge): string {
    const source = this.getNodePosition(edge.source);
    const target = this.getNodePosition(edge.target);
    
    const nodeRadius = 24;
    const arrowSpace = 16;
    
    if (edge.source === '3' && (edge.target === '4' || edge.target === '5')) {
      const startX = source.x + nodeRadius + 6;
      const startY = source.y;
      
      const firstHorizontalLength = 50;
      const turnX = startX + firstHorizontalLength;
      
      const verticalEndY = target.y;
      
      const finalHorizontalLength = 80;
      const endX = target.x - finalHorizontalLength;
      const endY = target.y;
      
      const arrowTipX = target.x - nodeRadius - arrowSpace - 6;

      return `M ${startX},${startY} L ${turnX},${startY} L ${turnX},${endY} L ${arrowTipX},${endY}`;
    }
    
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const angle = Math.atan2(dy, dx);
    
    const startX = source.x + Math.cos(angle) * (nodeRadius + 6);
    const startY = source.y + Math.sin(angle) * (nodeRadius + 6);
    const endX = target.x - Math.cos(angle) * (nodeRadius + arrowSpace + 6);
    const endY = target.y - Math.sin(angle) * (nodeRadius + arrowSpace + 6);
    
    return `M ${startX},${startY} L ${endX},${endY}`;
  }

  getNodeIcon(nodeId: string): string {
    const icons: Record<string, string> = {
      '1': '📧',
      '2': '💻',
      '3': '💻',
      '4': '💻',
      '5': '💻',
    };
    return icons[nodeId] || '💻';
  }

  onNodeClick(node: GraphNode, event: MouseEvent): void {
    event.stopPropagation();
    this.graphService.selectNode(node, { x: 0, y: 0 });
  }

  onNodeHover(node: GraphNode, event: MouseEvent): void {
    const tooltipData = this.getTooltipData(node);
    
    let x = (node.x ?? 0) - 140;
    let y = (node.y ?? 0) - 120;
    
    if ((node.x ?? 0) < 200) {
      x = (node.x ?? 0) + 40;
    }
    
    if ((node.y ?? 0) < 140) {
      y = (node.y ?? 0) + 80;
    }
    
    const position = { x, y };
    this.hoveredNode.set({ node, data: tooltipData, position });
  }

  onNodeLeave(): void {
    this.hoveredNode.set(null);
  }

  private getTooltipData(node: GraphNode): NodeTooltipData {
    switch (node.id) {
      case '1':
        return {
          type: 'email',
          title: 'Lorem Ipsum Dolor Sit',
          gridNumbers: ['1.2.3.4', '1.2.3.4', '1.2.3.4', '1.2.3.4', '1.2.3.4', '1.2.3.4'],
          documentTitle: 'Lorem: 1.2.3.4'
        };
      case '2':
        return {
          type: 'server',
          serverName: 'Loremipsu',
          documentTitle: 'Lorem: Loremipsum Loremipsum 1.2.3.4',
          contentLines: ['1.2.3.4 Loremipsum 1.2.3.4 1.2.3.4']
        };
      case '3':
        return {
          type: 'server',
          serverName: 'Loremipsu',
          documentTitle: 'Lorem: Loremipsum Loremipsum 1.2.3.4',
          contentLines: ['1.2.3.4 Loremipsum 1.2.3.4 1.2.3.4']
        };
      case '4':
        return {
          type: 'branch-server',
          serverName: 'Loremipsumdolorsit',
          ipAddress: '192.168.1.1',
          documentTitle: 'Lorem: Lorem "Ipsum"',
          contentLines: ['Loremipsum Lorem 1234,5678']
        };
      case '5':
        return {
          type: 'branch-server',
          serverName: 'Loremipsumdolorsit002',
          ipAddress: '192.168.1.2',
          documentTitle: 'Lorem: Lorem "Ipsum"',
          contentLines: ['Loremipsum Lorem 1234,5678']
        };
      default:
        return { type: 'server' };
    }
  }

  onCanvasClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).tagName === 'svg') {
      this.graphService.clearSelection();
    }
  }
}