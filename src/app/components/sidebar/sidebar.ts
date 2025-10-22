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
    { icon: 'grid_view', label: 'Lorem' },  
    { icon: 'warning_amber', label: 'Lorem' },
    { icon: 'folder', label: 'Lorem' }, 
    { icon: 'zoom_in_map', label: 'Lorem', active: true }, 
    { icon: 'cable', label: 'Lorem' }, 
    { icon: 'description', label: 'Lorem' },
    { icon: 'segment', label: 'Lorem' }, 
  ];

  bottomMenuItems: MenuItem[] = [
    { icon: 'settings', label: 'Lorem' },
    { icon: 'shield', label: 'Lorem' },
  ];

  toggleSidebar(): void {
    this.isCollapsed.update(collapsed => !collapsed);
  }
}