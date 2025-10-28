import { Injectable, signal, Signal } from '@angular/core';
import { GraphData, GraphNode, PopoverData, NodeDetails, Asset } from '../models/graph.model';

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
    this.setDefaultPopover();
  }

  loadGraphData(): void {
    this._isLoading.set(true);
    
    setTimeout(() => {
      const mockData: GraphData = {
        nodes: [
          { 
            id: '1', 
            label: 'Loremipsumm', 
            value: 100, 
            color: '#A78BFA',
            badge: 2,
            status: 'critical'
          },
          { 
            id: '2', 
            label: 'Loremipsu', 
            value: 200, 
            color: '#3B82F6',
            status: 'info'
          },
          { 
            id: '3', 
            label: 'Loremipsu', 
            value: 150, 
            color: '#3B82F6',
            status: 'info'
          },
          { 
            id: '4', 
            label: 'Loremipsumdolorsit', 
            sublabel: '192.168.1.1',
            value: 300, 
            color: '#3B82F6',
            badge: 19,
            status: 'critical'
          },
          { 
            id: '5', 
            label: 'Loremipsumdolorsit002', 
            sublabel: '192.168.1.2',
            value: 250, 
            color: '#3B82F6',
            badge: 9,
            status: 'critical'
          },
        ],
        edges: [
          { source: '1', target: '2', animated: true },
          { source: '2', target: '3' },
          { source: '3', target: '4' },
          { source: '3', target: '5' },
        ]
      };
      
      this._graphData.set(mockData);
      this._isLoading.set(false);
    }, 500);
  }
  
  private setDefaultPopover(): void {
    const details: NodeDetails = {
      title: 'Lorem Ipsum Dolor Sit',
      description: 'Lorem Ipsum Dolor Sit Amet Consectetur. Aenean Sodales Pellentesque Gravida Nibh Et Magna Faucibus. Dui Commodo Ut Metus Amet Egestas Habitant Viverra. Quisque Fusce Senectus Facilisis Non Diam Leo Nulla Sem Pellentesque. Sit In Vel Sed Cursus Metus Sit Fringilla Vestibulum.',
      assets: [
        // Page 1: 2 Critical
        { 
          id: '1', 
          name: 'Loremipsumdolorsit', 
          ipAddress: '192.168.1.1',
          riskLevel: 'Critical'
        },
        { 
          id: '2', 
          name: 'Loremipsumdolorsit002', 
          ipAddress: '192.168.1.2',
          riskLevel: 'Critical'
        },
        // Page 2: 1 Critical + 1 Low
        { 
          id: '3', 
          name: 'Loremipsumdolorsit', 
          ipAddress: '192.168.1.1',
          riskLevel: 'Critical'
        },
        { 
          id: '4', 
          name: 'Loremipsumdolorsit002', 
          ipAddress: '192.168.1.2',
          riskLevel: 'Low'
        }
      ],
      metadata: {
        date: '10/19/2017',
        type: 'Ut',
        status: 'Eros',
        verified: true
      },
      riskSummary: {
        critical: 3,
        high: 0,
        medium: 0,
        low: 1
      }
    };
  
    this._selectedNode.set({ 
      node: { id: '1', label: 'Default', value: 0 }, 
      details, 
      position: { x: 0, y: 0 } 
    });
  }
  
  selectNode(node: GraphNode, position: { x: number; y: number }): void {
    const details: NodeDetails = {
      title: 'Lorem Ipsum Dolor Sit',
      description: 'Lorem Ipsum Dolor Sit Amet Consectetur. Aenean Sodales Pellentesque Gravida Nibh Et Magna Faucibus. Dui Commodo Ut Metus Amet Egestas Habitant Viverra. Quisque Fusce Senectus Facilisis Non Diam Leo Nulla Sem Pellentesque. Sit In Vel Sed Cursus Metus Sit Fringilla Vestibulum.',
      assets: [
        // Page 1: 2 Critical
        { 
          id: '1', 
          name: 'Loremipsumdolorsit', 
          ipAddress: '192.168.1.1',
          riskLevel: 'Critical'
        },
        { 
          id: '2', 
          name: 'Loremipsumdolorsit002', 
          ipAddress: '192.168.1.2',
          riskLevel: 'Critical'
        },
        // Page 2: 1 Critical + 1 Low
        { 
          id: '3', 
          name: 'Loremipsumdolorsit', 
          ipAddress: '192.168.1.1',
          riskLevel: 'Critical'
        },
        { 
          id: '4', 
          name: 'Loremipsumdolorsit002', 
          ipAddress: '192.168.1.2',
          riskLevel: 'Low'
        }
      ],
      metadata: {
        date: '10/19/2017',
        type: 'Ut',
        status: 'Eros',
        verified: true
      },
      riskSummary: {
        critical: 3,
        high: 0,
        medium: 0,
        low: 1
      }
    };
  
    this._selectedNode.set({ node, details, position });
  }

  clearSelection(): void {
  }
}