import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface MenuItem {
  icon: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  isCollapsed = signal(false);

  menuItems: MenuItem[] = [
    { icon: 'grid_view', label: 'Lorem' },           // Grid icon
    { icon: 'warning_amber', label: 'Lorem' },       // Triangle warning
    { icon: 'description', label: 'Lorem' },         // Document/file
    { icon: 'gps_fixed', label: 'Lorem', active: true }, // Target/crosshair
    { icon: 'settings', label: 'Lorem' },            // Settings gear
    { icon: 'folder', label: 'Lorem' },              // Folder
    { icon: 'layers', label: 'Lorem' },              // Layers/stacked
  ];

  bottomMenuItems: MenuItem[] = [
    { icon: 'star', label: 'Lorem' },
    { icon: 'shield', label: 'Lorem' },
  ];

  toggleSidebar(): void {
    this.isCollapsed.update(collapsed => !collapsed);
  }
}