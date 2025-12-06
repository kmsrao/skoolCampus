export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: number[]) => import("@nestjs/common").CustomDecorator<string>;
export declare enum UserRole {
    SUPERADMIN = 1,
    ADMIN = 2,
    TEACHER = 3,
    ACCOUNTANT = 4,
    LIBRARIAN = 5,
    PARENT = 6,
    STUDENT = 7
}
