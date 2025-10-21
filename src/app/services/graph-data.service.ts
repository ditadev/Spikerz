import { Injectable, signal, Signal } from '@angular/core';
import { GraphData, GraphNode, PopoverData } from '../models/graph.model';

@Injectable({
  providedIn: 'root'
})
export class GraphDataService {
  public readonly graphData: Signal<GraphData | null>;
  public readonly selectedNode: Signal<PopoverData | null>;
  public readonly isLoading: Signal<boolean>;

  private readonly _graphData = signal<GraphData | null>(null);
  private readonly _selectedNode = signal<PopoverData | null>(null);
  private readonly _isLoading = signal<boolean>(false);

  constructor() {
    this.graphData = this._graphData.asReadonly();
    this.selectedNode = this._selectedNode.asReadonly();
    this.isLoading = this._isLoading.asReadonly();
    
    this.loadGraphData();
  }

  loadGraphData(): void {
    this._isLoading.set(true);
    
    setTimeout(() => {
      const mockData: GraphData = {
        nodes: [
          { id: '1', label: 'Node 1', value: 100, color: '#3B82F6' },
          { id: '2', label: 'Node 2', value: 200, color: '#10B981' },
          { id: '3', label: 'Node 3', value: 150, color: '#F59E0B' },
          { id: '4', label: 'Node 4', value: 300, color: '#EF4444' },
        ],
        edges: [
          { source: '1', target: '2', value: 50 },
          { source: '2', target: '3', value: 75 },
          { source: '3', target: '4', value: 100 },
        ]
      };
      
      this._graphData.set(mockData);
      this._isLoading.set(false);
    }, 500);
  }

  selectNode(node: GraphNode, position: { x: number; y: number }): void {
    this._selectedNode.set({ node, position });
  }

  clearSelection(): void {
    this._selectedNode.set(null);
  }
}