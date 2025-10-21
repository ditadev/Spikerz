import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphViewComponent } from '../graph-view/graph-view';
import { NodePopoverComponent } from '../node-popover/node-popover';
import { GraphDataService } from '../../services/graph-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, GraphViewComponent, NodePopoverComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  readonly graphService: GraphDataService = inject(GraphDataService);
}