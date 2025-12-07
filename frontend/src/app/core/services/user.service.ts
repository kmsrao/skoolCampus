import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  getProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/profile`);
  }

  updateProfile(data: UpdateProfileRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${environment.apiUrl}/users/profile`,
      data
    );
  }

  changePassword(data: ChangePasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${environment.apiUrl}/users/change-password`,
      data
    );
  }
}
