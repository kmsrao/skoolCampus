import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService, DashboardData } from '../../core/services/dashboard.service';
import { User, UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    ChartModule,
    SkeletonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);

  currentUser = signal<User | null>(null);
  dashboardData = signal<DashboardData | null>(null);
  loading = signal<boolean>(true);

  // Chart options
  barChartOptions: any;
  pieChartOptions: any;
  lineChartOptions: any;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser.set(user);
      if (user) {
        this.loadDashboard(user);
      }
    });

    this.setupChartOptions();
  }

  loadDashboard(user: User): void {
    this.loading.set(true);

    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.loading.set(false);
      },
    });
  }


  isAdminDashboard(): boolean {
    const user = this.currentUser();
    return (
      user?.userType === 'superadmin' ||
      user?.userType === 'staff'
    );
  }

  isStudentDashboard(): boolean {
    return this.currentUser()?.userType === 'student';
  }

  isParentDashboard(): boolean {
    return this.currentUser()?.userType === 'parent';
  }

  private setupChartOptions(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.barChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    this.pieChartOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };

    this.lineChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
  }

  getStudentByClassChartData(): any {
    const data = this.dashboardData()?.charts?.studentByClass || [];
    return {
      labels: data.map((item: any) => item.name),
      datasets: [
        {
          data: data.map((item: any) => item.value),
          backgroundColor: [
            '#42A5F5',
            '#66BB6A',
            '#FFA726',
            '#26C6DA',
            '#AB47BC',
            '#FF7043',
          ],
          hoverBackgroundColor: [
            '#64B5F6',
            '#81C784',
            '#FFB74D',
            '#4DD0E1',
            '#BA68C8',
            '#FF8A65',
          ],
        },
      ],
    };
  }

  getIncomeVsExpenseChartData(): any {
    const data = this.dashboardData()?.charts?.incomeVsExpense || [];
    return {
      labels: data.map((item: any) => item.name),
      datasets: [
        {
          data: data.map((item: any) => item.value),
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverBackgroundColor: ['#FF8CA3', '#5AB8F0'],
        },
      ],
    };
  }

  getWeekendAttendanceChartData(): any {
    const data = this.dashboardData()?.charts?.weekendAttendance;
    if (!data) return { labels: [], datasets: [] };

    return {
      labels: data.days || [],
      datasets: [
        {
          label: 'Students',
          data: data.studentAtt?.map((item: any) => item.y) || [],
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4,
        },
        {
          label: 'Staff',
          data: data.employeeAtt?.map((item: any) => item.y) || [],
          fill: false,
          borderColor: '#66BB6A',
          tension: 0.4,
        },
      ],
    };
  }
}
