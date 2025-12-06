export declare class LoginDto {
    username: string;
    password: string;
}
export declare class LoginResponseDto {
    accessToken: string;
    user: {
        id: number;
        userId: number;
        username: string;
        role: number;
        name: string;
        photo: string;
        branchId: number;
        userType: string;
    };
}
