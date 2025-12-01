import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: number[]) => SetMetadata(ROLES_KEY, roles);

// Role constants
export enum UserRole {
  SUPERADMIN = 1,
  ADMIN = 2,
  TEACHER = 3,
  ACCOUNTANT = 4,
  LIBRARIAN = 5,
  PARENT = 6,
  STUDENT = 7,
}
