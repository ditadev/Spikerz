import { Component, inject, signal, effect, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphDataService } from '../../services/graph-data.service';
import { PopoverData } from '../../models/graph.model';

@Component({
  selector: 'app-node-popover',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './node-popover.html',
  styleUrls: ['./node-popover.scss']
})
export class NodePopoverComponent {
  private readonly graphService: GraphDataService = inject(GraphDataService);
  
  readonly popoverData: Signal<PopoverData | null> = this.graphService.selectedNode;
  position = signal({ x: 0, y: 0 });

  constructor() {
    effect(() => {
      const data = this.popoverData();
      if (data) {
        this.position.set(data.position);
      }
    });
  }

  close(): void {
    this.graphService.clearSelection();
  }
}