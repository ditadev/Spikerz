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
      { x: startX + baseSpacing * 3, y: centerY - branchOffset },
      { x: startX + baseSpacing * 3, y: centerY + branchOffset },
    ];

    return nodes.map((node, index) => ({
      ...node,
      x: positions[index]?.x ?? startX + index * baseSpacing,
      y: positions[index]?.y ?? centerY,
    }));
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBranchPath(edge: GraphEdge, _direction: 'up' | 'down'): string {
    const source = this.getNodePosition(edge.source);
    const target = this.getNodePosition(edge.target);

    const nodeRadius = 24;
    const arrowSpace = 12;

    const startX = source.x + nodeRadius + 8;
    const startY = source.y;

    const endX = target.x - nodeRadius - arrowSpace;
    const endY = target.y;

    const availableWidth = endX - startX;

    const firstSegmentRatio = 0.3886;
    const firstSegmentLength = availableWidth * firstSegmentRatio;
    const turn1X = startX + firstSegmentLength;

    const curveRatio = 0.3075;
    const curveLength = availableWidth * curveRatio;
    const curveEndX = turn1X + curveLength;

    const cp1X = turn1X + curveLength * 0.5;
    const cp1Y = startY;
    const cp2X = turn1X + curveLength * 0.5;
    const cp2Y = endY;

    return `
      M ${startX},${startY}
      L ${turn1X},${startY}
      C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${curveEndX},${endY}
      L ${endX},${endY}
    `
      .trim()
      .replace(/\s+/g, ' ');
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
