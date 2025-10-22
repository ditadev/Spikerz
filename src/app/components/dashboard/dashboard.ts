import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from '../shared/card/card';
import { SidebarComponent } from '../sidebar/sidebar';
import { GraphViewComponent } from '../graph-view/graph-view';
import { NodePopoverComponent } from '../node-popover/node-popover';
import { CollapsibleCardsComponent } from '../collapsible-cards/collapsible-cards';
import { GraphDataService } from '../../services/graph-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    CardComponent,
    SidebarComponent, 
    GraphViewComponent, 
    NodePopoverComponent,
    CollapsibleCardsComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  readonly graphService: GraphDataService = inject(GraphDataService);
}