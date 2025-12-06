export declare class UpdateProfileDto {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
