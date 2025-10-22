import { Component, inject, signal, effect, ViewChild, ElementRef, OnDestroy } from '@angular/core';
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
export class GraphViewComponent implements OnDestroy {
  @ViewChild('svgCanvas', { static: false }) svgCanvas?: ElementRef<SVGSVGElement>;
  
  private readonly graphService: GraphDataService = inject(GraphDataService);
  
  nodes = signal<GraphNode[]>([]);
  edges = signal<GraphEdge[]>([]);
  hoveredNode = signal<{ node: GraphNode; data: NodeTooltipData; position: { x: number; y: number } } | null>(null);
  
  private resizeHandler: (() => void) | null = null;

  constructor() {
    effect(() => {
      const data = this.graphService.graphData();
      if (data) {
        const positionedNodes = this.layoutNodes(data.nodes);
        this.nodes.set(positionedNodes);
        this.edges.set(data.edges);
      }
    });
    
    // Listen for window resize
    if (typeof window !== 'undefined') {
      this.resizeHandler = () => this.onResize();
      window.addEventListener('resize', this.resizeHandler);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeHandler && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  private layoutNodes(nodes: GraphNode[]): GraphNode[] {
    const centerY = 140;
    
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const isLargeScreen = screenWidth >= 1024;
    const isMediumScreen = screenWidth >= 768 && screenWidth < 1024;
    
    const startX = 30; 
    const branchOffset = 90;
    
    const nodeGap = isLargeScreen ? 48 : 0; 
    const baseSpacing = isMediumScreen ? 160 : 140;
    
    const branchExtraSpace = !isLargeScreen && !isMediumScreen ? 20 : 0;
    
    const positions = [
      { x: startX, y: centerY },
      { x: startX + baseSpacing + nodeGap, y: centerY },
      { x: startX + (baseSpacing + nodeGap) * 2, y: centerY },
      { x: startX + (baseSpacing + nodeGap) * 3 + branchExtraSpace, y: centerY - branchOffset },
      { x: startX + (baseSpacing + nodeGap) * 3 + branchExtraSpace, y: centerY + branchOffset }
    ];
  
    return nodes.map((node, index) => ({
      ...node,
      x: positions[index]?.x ?? startX + (index * baseSpacing),
      y: positions[index]?.y ?? centerY
    }));
  }
  
  getViewBoxWidth(): number {
    const nodes = this.nodes();
    if (nodes.length === 0) return 650;
    
    const rightmostX = Math.max(...nodes.map(n => (n.x ?? 0)));
    const nodeRadius = 24;
    const badgeWidth = 30;
    const endPadding = 30;
    
    return Math.ceil(rightmostX + nodeRadius + badgeWidth + endPadding);
  }
  
  getMinWidth(): number {
    return this.getViewBoxWidth();
  }
  
  onNodeClick(node: GraphNode, event: MouseEvent): void {
    event.stopPropagation();
    this.graphService.selectNode(node, { x: 0, y: 0 });
  }
  
  onNodeHover(node: GraphNode, event: MouseEvent): void {
    const tooltipData = this.getTooltipData(node);
    
    const svgRect = this.svgCanvas?.nativeElement.getBoundingClientRect();
    const containerWidth = svgRect?.width ?? 650;
    
    let x = (node.x ?? 0) + 50; 
    let y = (node.y ?? 0) - 80;
    
    if ((node.x ?? 0) < 200) {
      x = (node.x ?? 0) + 50;
    }
    
    if ((node.x ?? 0) > containerWidth - 250) {
      x = (node.x ?? 0) - 250; 
    }
    
    if ((node.y ?? 0) < 100) {
      y = (node.y ?? 0) + 50;
    }
    
    const position = { x, y };
    this.hoveredNode.set({ node, data: tooltipData, position });
  }
  
  onNodeTouch(node: GraphNode, event: TouchEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    const tooltipData = this.getTooltipData(node);
    
    const svgRect = this.svgCanvas?.nativeElement.getBoundingClientRect();
    const containerWidth = svgRect?.width ?? 650;
    
    let x = (node.x ?? 0) + 50; 
    let y = (node.y ?? 0) - 80;
    
    if ((node.x ?? 0) < 200) {
      x = (node.x ?? 0) + 50;
    }
    
    if ((node.x ?? 0) > containerWidth - 250) {
      x = (node.x ?? 0) - 250;
    }
    
    if ((node.y ?? 0) < 100) {
      y = (node.y ?? 0) + 50;
    }
    
    const position = { x, y };
    this.hoveredNode.set({ node, data: tooltipData, position });
    
    // Auto-hide tooltip after 3 seconds on mobile
    setTimeout(() => {
      this.hoveredNode.set(null);
    }, 3000);
  }
  
  onNodeLeave(): void {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    if (screenWidth >= 768) {
      this.hoveredNode.set(null);
    }
  }

  getBranchPath(edge: GraphEdge, direction: 'up' | 'down'): string {
    const source = this.getNodePosition(edge.source);
    const target = this.getNodePosition(edge.target);
    
    const nodeRadius = 24;
    const arrowSpace = 12; // Increased from 8 to 12 to ensure arrowhead is visible
    
    // Start point: right edge of node 3 with spacing
    const startX = source.x + nodeRadius + 8;
    const startY = source.y;
    
    // End point: left edge of target node with MORE spacing for arrowhead
    const endX = target.x - nodeRadius - arrowSpace;
    const endY = target.y;
    
    // Calculate available width
    const availableWidth = endX - startX;
    
    // From the SVG: proportions
    const firstSegmentRatio = 0.3886;
    const firstSegmentLength = availableWidth * firstSegmentRatio;
    const turn1X = startX + firstSegmentLength;
    
    const curveRatio = 0.3075;
    const curveLength = availableWidth * curveRatio;
    const curveEndX = turn1X + curveLength;
    
    // Control points for cubic bezier curve
    const cp1X = turn1X + curveLength * 0.5;
    const cp1Y = startY;
    const cp2X = turn1X + curveLength * 0.5;
    const cp2Y = endY;
    
    // Path: horizontal → smooth S-curve → horizontal
    return `
      M ${startX},${startY}
      L ${turn1X},${startY}
      C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${curveEndX},${endY}
      L ${endX},${endY}
    `.trim().replace(/\s+/g, ' ');
  }

  private onResize(): void {
    const data = this.graphService.graphData();
    if (data) {
      const positionedNodes = this.layoutNodes(data.nodes);
      this.nodes.set(positionedNodes);
    }
  }

  getNodePosition(nodeId: string): { x: number; y: number } {
    const node = this.nodes().find(n => n.id === nodeId);
    return node ? { x: node.x ?? 0, y: node.y ?? 0 } : { x: 0, y: 0 };
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