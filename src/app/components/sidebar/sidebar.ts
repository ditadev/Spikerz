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
    { icon: 'folder', label: 'Lorem' },              // Folder
    { icon: 'zoom_in_map', label: 'Lorem', active: true }, // Zoom in map
    { icon: 'cable', label: 'Lorem' },            // Cable
    { icon: 'description', label: 'Lorem' },         // Document/file
    { icon: 'segment', label: 'Lorem' },              // Segment
  ];

  bottomMenuItems: MenuItem[] = [
    { icon: 'settings', label: 'Lorem' },
    { icon: 'shield', label: 'Lorem' },
  ];

  toggleSidebar(): void {
    this.isCollapsed.update(collapsed => !collapsed);
  }
}