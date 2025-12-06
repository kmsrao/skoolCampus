import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/update-profile.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: number, role: number): Promise<{
        username: string;
        id: number;
        name: string;
        email: string;
        photo: string;
        branchId: number;
    } | {
        username: string;
        name: string;
        photo: any;
        branch_id: any;
        email: any;
    }>;
    updateProfile(userId: number, role: number, updateProfileDto: UpdateProfileDto): Promise<{
        message: string;
    }>;
    changePassword(userId: number, role: number, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
