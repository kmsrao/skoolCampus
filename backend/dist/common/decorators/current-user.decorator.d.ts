export interface CurrentUserData {
    id: number;
    userId: number;
    username: string;
    role: number;
    branchId: number;
    name: string;
    photo: string;
    userType: string;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
