import { Component, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MenuItem {
  icon: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent implements OnInit {
  isCollapsed = signal(false);
  activeMenuIndex = signal(3);
  activeBottomMenuIndex = signal<number | null>(null);

  menuItems: MenuItem[] = [
    { icon: 'icon1', label: 'Lorem' },
    { icon: 'icon2', label: 'Lorem' },
    { icon: 'icon3', label: 'Lorem' },
    { icon: 'icon4', label: 'Lorem' },
    { icon: 'icon5', label: 'Lorem' },
    { icon: 'icon6', label: 'Lorem' },
    { icon: 'icon7', label: 'Lorem' },
  ];

  bottomMenuItems: MenuItem[] = [
    { icon: 'settings', label: 'Lorem' },
    { icon: 'notification', label: 'Lorem' },
  ];

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const isMobile = window.innerWidth <= 768;
    this.isCollapsed.set(isMobile);
  }

  getIconPath(iconName: string): string {
    return `assets/icons/${iconName}.svg`;
  }

  toggleSidebar(): void {
    this.isCollapsed.update(collapsed => !collapsed);
  }

  selectMenuItem(index: number): void {
    this.activeMenuIndex.set(index);
    this.activeBottomMenuIndex.set(null);
  }

  selectBottomMenuItem(index: number): void {
    this.activeBottomMenuIndex.set(index);
    this.activeMenuIndex.set(-1);
  }
}