import { Component, inject, signal, effect, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphDataService } from '../../services/graph-data.service';
import { PopoverData, Asset } from '../../models/graph.model';

@Component({
  selector: 'app-node-popover',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './node-popover.html',
  styleUrls: ['./node-popover.scss']
})
export class NodePopoverComponent {
  private readonly graphService: GraphDataService = inject(GraphDataService);
  Math = Math; 

  readonly popoverData: Signal<PopoverData | null> = this.graphService.selectedNode;
  currentPage = signal(1);
  pageSize = 2;

  constructor() {
    effect(() => {
      const data = this.popoverData();
      if (data) {
        this.currentPage.set(1);
      }
    });
  }

  get paginatedAssets(): Asset[] {
    const data = this.popoverData();
    if (!data) return [];
    
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return data.details.assets.slice(start, end);
  }

  get totalPages(): number {
    const data = this.popoverData();
    if (!data) return 0;
    return Math.ceil(data.details.assets.length / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  // Donut chart calculations
  getCircumference(): number {
    const radius = 45;
    return 2 * Math.PI * radius;
  }

  getDashOffset(): number {
    const data = this.popoverData();
    if (!data) return this.getCircumference();
    
    const total = data.details.riskSummary.critical + 
                  data.details.riskSummary.high + 
                  data.details.riskSummary.medium + 
                  data.details.riskSummary.low;
    
    if (total === 0) return this.getCircumference();
    
    const criticalPercentage = data.details.riskSummary.critical / total;
    const circumference = this.getCircumference();
    
    // Show the critical portion (inverse for stroke-dashoffset)
    return circumference - (circumference * criticalPercentage);
  }

  getRiskColor(level: string): string {
    const colors: Record<string, string> = {
      'Critical': '#EF4444',
      'High': '#F59E0B',
      'Medium': '#FCD34D',
      'Low': '#10B981'
    };
    return colors[level] || '#6B7280';
  }

  close(): void {
    this.graphService.clearSelection();
  }
}