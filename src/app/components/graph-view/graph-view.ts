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
  badges?: { color: string; text: string }[];
}

@Component({
  selector: 'app-graph-view',
  standalone: true,
  imports: [CommonModule, NodeTooltipComponent],
  templateUrl: './graph-view.html',
  styleUrls: ['./graph-view.scss'],
})
export class GraphViewComponent implements OnDestroy {
  @ViewChild('svgCanvas', { static: false }) svgCanvas?: ElementRef<SVGSVGElement>;

  private readonly graphService: GraphDataService = inject(GraphDataService);

  nodes = signal<GraphNode[]>([]);
  edges = signal<GraphEdge[]>([]);
  hoveredNode = signal<{
    node: GraphNode;
    data: NodeTooltipData;
    position: { x: number; y: number };
  } | null>(null);

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
    const centerY = 115;

    const startX = 130;
    const branchOffset = 70;
    const baseSpacing = 128;

    const positions = [
      { x: startX, y: centerY },
      { x: startX + baseSpacing, y: centerY },
      { x: startX + baseSpacing * 2, y: centerY },
      { x: startX + baseSpacing * 3 + 120, y: centerY - branchOffset }, // Moved node 4 right by 20px
      { x: startX + baseSpacing * 3 + 120, y: centerY + branchOffset }, // Moved node 5 right by 20px
    ];

    return nodes.map((node, index) => ({
      ...node,
      x: positions[index]?.x ?? startX + index * baseSpacing,
      y: positions[index]?.y ?? centerY,
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBranchPath(edge: GraphEdge, _direction: 'up' | 'down'): string {
    const source = this.getNodePosition(edge.source);
    const target = this.getNodePosition(edge.target);

    const nodeRadius = 24;

    // Start point - right edge of source node
    const startX = source.x + nodeRadius + 4;
    const startY = source.y;

    // End point - MUCH closer to target (12px from edge instead of previous distances)
    const endX = target.x - nodeRadius + 12; // +12 makes the final straight segment VERY long
    const endY = target.y;

    // Calculate control points
    const horizontalDistance = endX - startX;

    // First horizontal segment (about 30% of total distance)
    const firstSegmentLength = horizontalDistance * 0.3;
    const curveStartX = startX + firstSegmentLength;

    // Curve segment (about 50% of total distance)
    const curveLength = horizontalDistance * 0.5;
    const curveEndX = curveStartX + curveLength;

    // Control points for smooth bezier curve
    const controlPoint1X = curveStartX + curveLength * 0.3;
    const controlPoint1Y = startY;

    const controlPoint2X = curveStartX + curveLength * 0.7;
    const controlPoint2Y = endY;

    // Final L segment from curveEndX to endX is now VISIBLY longer (20% of total path)
    return `
      M ${startX},${startY}
      L ${curveStartX},${startY}
      C ${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${curveEndX},${endY}
      L ${endX},${endY}
    `
      .trim()
      .replace(/\s+/g, ' ');
  }

  private onResize(): void {
    const data = this.graphService.graphData();
    if (data) {
      const positionedNodes = this.layoutNodes(data.nodes);
      this.nodes.set(positionedNodes);
    }
  }

  getNodePosition(nodeId: string): { x: number; y: number } {
    const node = this.nodes().find((n) => n.id === nodeId);
    return node ? { x: node.x ?? 0, y: node.y ?? 0 } : { x: 0, y: 0 };
  }

  onNodeClick(_node: GraphNode, _event: MouseEvent): void {
    _event.stopPropagation();
  }

  onNodeTouch(node: GraphNode, event: TouchEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNodeHover(node: GraphNode, event: MouseEvent): void {
    const tooltipData = this.getTooltipData(node);

    const svgRect = this.svgCanvas?.nativeElement.getBoundingClientRect();
    const containerWidth = svgRect?.width ?? 649;
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const isMobile = screenWidth < 768;

    let x = (node.x ?? 0) + 50;
    let y = (node.y ?? 0) - 80;

    if (isMobile) {
      if (node.id === '4' || node.id === '5') {
        x = (node.x ?? 0) - 260;
      } else {
        x = containerWidth / 2 - 120;
      }
    } else {
      if ((node.x ?? 0) < 200) {
        x = (node.x ?? 0) + 50;
      }

      if ((node.x ?? 0) > containerWidth - 250) {
        x = (node.x ?? 0) - 250;
      }
    }

    if ((node.y ?? 0) < 100) {
      y = (node.y ?? 0) + 50;
    }

    const position = { x, y };
    this.hoveredNode.set({ node, data: tooltipData, position });
  }

  onNodeLeave(): void {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    if (screenWidth >= 768) {
      this.hoveredNode.set(null);
    }
  }

  private getTooltipData(node: GraphNode): NodeTooltipData {
    switch (node.id) {
      case '1':
        return {
          type: 'email',
          title: 'Lorem Ipsum Dolor Sit',
          gridNumbers: ['1.2.3.4', '1.2.3.4', '1.2.3.4', '1.2.3.4', '1.2.3.4', '1.2.3.4'],
          documentTitle: 'Lorem: 1.2.3.4',
        };
      case '2':
        return {
          type: 'server',
          serverName: 'Loremipsu',
          documentTitle: 'Lorem: Loremipsum Loremipsum 1.2.3.4',
          contentLines: ['1.2.3.4 Loremipsum 1.2.3.4 1.2.3.4'],
        };
      case '3':
        return {
          type: 'server',
          serverName: 'Loremipsu',
          documentTitle: 'Lorem: Loremipsum Loremipsum 1.2.3.4',
          contentLines: ['1.2.3.4 Loremipsum 1.2.3.4 1.2.3.4'],
        };
      case '4':
        return {
          type: 'branch-server',
          serverName: 'Loremipsumdolorsit',
          ipAddress: '192.168.1.1',
          documentTitle: 'Lorem: Lorem "Ipsum"',
          contentLines: ['Loremipsum Lorem 1234,5678'],
        };
      case '5':
        return {
          type: 'branch-server',
          serverName: 'Loremipsumdolorsit002',
          ipAddress: '192.168.1.2',
          documentTitle: 'Lorem: Lorem "Ipsum"',
          contentLines: ['Loremipsum Lorem 1234,5678'],
        };
      default:
        return { type: 'server' };
    }
  }

  onCanvasClick(event: Event): void {
    if ((event.target as HTMLElement).tagName === 'svg') {
      this.graphService.clearSelection();
    }
  }
}
