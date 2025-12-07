import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ButtonModule, TooltipModule, TitleCasePipe],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = signal<any>(null);
  sidebarCollapsed = false;

  constructor() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser.set(user);
    });
  }

  menuItems = computed(() => {
    const user = this.currentUser();
    const baseItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        route: '/dashboard',
        visible: true,
      },
      {
        label: 'Profile',
        icon: 'pi pi-user',
        route: '/profile',
        visible: true,
      },
    ];

    // Add role-specific menu items
    if (user?.role === 1) {
      // Admin
      return [
        ...baseItems,
        {
          label: 'Students',
          icon: 'pi pi-users',
          route: '/students',
          visible: true,
        },
        {
          label: 'Staff',
          icon: 'pi pi-id-card',
          route: '/staff',
          visible: true,
        },
        {
          label: 'Classes',
          icon: 'pi pi-book',
          route: '/classes',
          visible: true,
        },
        {
          label: 'Attendance',
          icon: 'pi pi-calendar-check',
          route: '/attendance',
          visible: true,
        },
        {
          label: 'Reports',
          icon: 'pi pi-chart-bar',
          route: '/reports',
          visible: true,
        },
      ];
    }

    return baseItems;
  });

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}
