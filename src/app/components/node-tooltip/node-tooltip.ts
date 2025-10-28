import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  selector: 'app-node-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './node-tooltip.html',
  styleUrls: ['./node-tooltip.scss'],
})
export class NodeTooltipComponent {
  @Input() data: NodeTooltipData | null = null;
  @Input() position: { x: number; y: number } = { x: 0, y: 0 };
}
