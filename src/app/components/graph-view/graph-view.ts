import { Component, inject, signal, effect, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphDataService } from '../../services/graph-data.service';
import { GraphNode, GraphEdge } from '../../models/graph.model';

@Component({
  selector: 'app-graph-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graph-view.html',
  styleUrls: ['./graph-view.scss']
})
export class GraphViewComponent {
  private readonly graphService: GraphDataService = inject(GraphDataService);
  
  nodes = signal<GraphNode[]>([]);
  edges = signal<GraphEdge[]>([]);

  constructor() {
    effect(() => {
      const data = this.graphService.graphData();
      if (data) {
        const centerX = 400;
        const centerY = 250;
        const radius = 150;
        
        const positionedNodes = data.nodes.map((node: GraphNode, index: number) => {
          const angle = (2 * Math.PI * index) / data.nodes.length;
          return {
            ...node,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
          };
        });
        
        this.nodes.set(positionedNodes);
        this.edges.set(data.edges);
      }
    });
  }

  getNodePosition(nodeId: string): { x: number; y: number } {
    const node = this.nodes().find(n => n.id === nodeId);
    return node ? { x: node.x ?? 0, y: node.y ?? 0 } : { x: 0, y: 0 };
  }

  onNodeClick(node: GraphNode, event: MouseEvent): void {
    event.stopPropagation();
    this.graphService.selectNode(node, {
      x: event.clientX,
      y: event.clientY
    });
  }

  onCanvasClick(event: MouseEvent): void {
    this.graphService.clearSelection();
  }
}