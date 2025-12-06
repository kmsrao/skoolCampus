import { UsersService } from './users.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/update-profile.dto';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: CurrentUserData): Promise<{
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
    updateProfile(user: CurrentUserData, updateProfileDto: UpdateProfileDto): Promise<{
        message: string;
    }>;
    changePassword(user: CurrentUserData, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
