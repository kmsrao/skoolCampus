export interface User {
  id: number;
  userId: number;
  username: string;
  role: number;
  name: string;
  photo: string | null;
  branchId: number | null;
  userType: 'superadmin' | 'staff' | 'parent' | 'student';
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  username: string;
}

export interface ResetPasswordRequest {
  key: string;
  password: string;
  confirmPassword: string;
}

export enum UserRole {
  SUPERADMIN = 1,
  ADMIN = 2,
  TEACHER = 3,
  ACCOUNTANT = 4,
  LIBRARIAN = 5,
  PARENT = 6,
  STUDENT = 7,
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPERADMIN]: 'Super Admin',
  [UserRole.ADMIN]: 'Admin',
  [UserRole.TEACHER]: 'Teacher',
  [UserRole.ACCOUNTANT]: 'Accountant',
  [UserRole.LIBRARIAN]: 'Librarian',
  [UserRole.PARENT]: 'Parent',
  [UserRole.STUDENT]: 'Student',
};
