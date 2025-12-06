import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface DashboardData {
  counts?: {
    totalStudents: number;
    totalStaff: number;
    monthlyAdmissions: number;
    totalVouchers: number;
    totalRoutes: number;
  };
  charts?: {
    feesSummary: any;
    studentByClass: any[];
    incomeVsExpense: any[];
    weekendAttendance: any;
    monthlyAdmissionChart: number;
  };
  enrollment?: any;
  attendanceSummary?: any;
  feeSummary?: any;
  children?: any[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${environment.apiUrl}/dashboard`);
  }

  getAdminDashboard(branchId?: number): Observable<DashboardData> {
    if (branchId) {
      return this.http.get<DashboardData>(
        `${environment.apiUrl}/dashboard/admin`,
        { params: { branchId: branchId.toString() } }
      );
    }
    return this.http.get<DashboardData>(`${environment.apiUrl}/dashboard/admin`);
  }

  getStudentDashboard(studentId?: number): Observable<DashboardData> {
    if (studentId) {
      return this.http.get<DashboardData>(
        `${environment.apiUrl}/dashboard/student`,
        { params: { studentId: studentId.toString() } }
      );
    }
    return this.http.get<DashboardData>(`${environment.apiUrl}/dashboard/student`);
  }

  getParentDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(
      `${environment.apiUrl}/dashboard/parent`
    );
  }
}
