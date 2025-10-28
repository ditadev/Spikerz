import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphDataService } from '../../services/graph-data.service';

@Component({
  selector: 'app-node-popover',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './node-popover.html',
  styleUrls: ['./node-popover.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodePopoverComponent {
  private readonly graphService = inject(GraphDataService);
  Math = Math;

  readonly popoverData = this.graphService.selectedNode;
  readonly currentPage = signal(1);
  readonly pageSize = 2;

  readonly paginatedAssets = computed(() => {
    const data = this.popoverData();
    if (!data) return [];

    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    const result = data.details.assets.slice(start, end);

    return result;
  });

  readonly totalPages = computed(() => {
    const data = this.popoverData();
    if (!data) return 0;
    return Math.ceil(data.details.assets.length / this.pageSize);
  });

  readonly currentPageRiskSummary = computed(() => {
    const assets = this.paginatedAssets();

    const summary = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    assets.forEach((asset) => {
      const level = asset.riskLevel;
      if (level === 'Critical') summary.critical++;
      else if (level === 'High') summary.high++;
      else if (level === 'Medium') summary.medium++;
      else if (level === 'Low') summary.low++;
    });

    return summary;
  });

  nextPage(): void {
    const current = this.currentPage();
    const total = this.totalPages();

    if (current < total) {
      this.currentPage.set(current + 1);
    }
  }

  prevPage(): void {
    const current = this.currentPage();

    if (current > 1) {
      this.currentPage.set(current - 1);
    }
  }

  // Donut chart calculations
  getCircumference(): number {
    return 2 * Math.PI * 50; // ~314.159
  }

  private getTotalRisks(): number {
    const summary = this.currentPageRiskSummary();
    return summary.critical + summary.high + summary.medium + summary.low;
  }

  // Get stroke-dasharray for each segment (segmentLength, remainingCircumference)
  getCriticalDashArray(): string {
    const summary = this.currentPageRiskSummary();
    const total = this.getTotalRisks();
    if (total === 0 || summary.critical === 0) return '0 314.159';

    const circumference = this.getCircumference();
    const segmentLength = (summary.critical / total) * circumference;

    return `${segmentLength} ${circumference - segmentLength}`;
  }

  getHighDashArray(): string {
    const summary = this.currentPageRiskSummary();
    const total = this.getTotalRisks();
    if (total === 0 || summary.high === 0) return '0 314.159';

    const circumference = this.getCircumference();
    const segmentLength = (summary.high / total) * circumference;

    return `${segmentLength} ${circumference - segmentLength}`;
  }

  getMediumDashArray(): string {
    const summary = this.currentPageRiskSummary();
    const total = this.getTotalRisks();
    if (total === 0 || summary.medium === 0) return '0 314.159';

    const circumference = this.getCircumference();
    const segmentLength = (summary.medium / total) * circumference;

    return `${segmentLength} ${circumference - segmentLength}`;
  }

  getLowDashArray(): string {
    const summary = this.currentPageRiskSummary();
    const total = this.getTotalRisks();
    if (total === 0 || summary.low === 0) return '0 314.159';

    const circumference = this.getCircumference();
    const segmentLength = (summary.low / total) * circumference;

    return `${segmentLength} ${circumference - segmentLength}`;
  }

  // Get stroke-dashoffset to position each segment
  getCriticalDashOffset(): number {
    return 0;
  }

  getHighDashOffset(): number {
    const summary = this.currentPageRiskSummary();
    const total = this.getTotalRisks();
    if (total === 0) return 0;

    const circumference = this.getCircumference();
    const criticalPercentage = summary.critical / total;

    // High starts after Critical
    return -(circumference * criticalPercentage);
  }

  getMediumDashOffset(): number {
    const summary = this.currentPageRiskSummary();
    const total = this.getTotalRisks();
    if (total === 0) return 0;

    const circumference = this.getCircumference();
    const criticalPercentage = summary.critical / total;
    const highPercentage = summary.high / total;

    // Medium starts after Critical + High
    return -(circumference * (criticalPercentage + highPercentage));
  }

  getLowDashOffset(): number {
    const summary = this.currentPageRiskSummary();
    const total = this.getTotalRisks();
    if (total === 0) return 0;

    const circumference = this.getCircumference();
    const criticalPercentage = summary.critical / total;
    const highPercentage = summary.high / total;
    const mediumPercentage = summary.medium / total;

    // Low starts after Critical + High + Medium
    return -(circumference * (criticalPercentage + highPercentage + mediumPercentage));
  }
}
