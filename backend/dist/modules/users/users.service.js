"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId, role) {
        const user = await this.prisma.getUserByRoleAndId(role, userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const loginCredential = await this.prisma.loginCredential.findFirst({
            where: {
                userId,
                role,
            },
        });
        return {
            ...user,
            username: loginCredential?.username,
        };
    }
    async updateProfile(userId, role, updateProfileDto) {
        const { name, email, phone, address } = updateProfileDto;
        switch (role) {
            case 6:
                await this.prisma.parent.update({
                    where: { id: userId },
                    data: {
                        name,
                        email,
                        mobileno: phone,
                        address,
                    },
                });
                break;
            case 7:
                const nameParts = name.split(' ');
                const firstName = nameParts[0] || name;
                const lastName = nameParts.slice(1).join(' ') || '';
                await this.prisma.student.update({
                    where: { id: userId },
                    data: {
                        firstName,
                        lastName,
                        email,
                        mobileno: phone,
                        currentAddress: address,
                    },
                });
                break;
            default:
                await this.prisma.staff.update({
                    where: { id: userId },
                    data: {
                        name,
                        email,
                        phone,
                        address,
                    },
                });
                break;
        }
        return { message: 'Profile updated successfully' };
    }
    async changePassword(userId, role, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const loginCredential = await this.prisma.loginCredential.findFirst({
            where: {
                userId,
                role,
            },
        });
        if (!loginCredential) {
            throw new common_1.NotFoundException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, loginCredential.password);
        if (!isPasswordValid) {
            throw new common_1.NotFoundException('Current password is incorrect');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.loginCredential.update({
            where: { id: loginCredential.id },
            data: {
                password: hashedPassword,
            },
        });
        return { message: 'Password changed successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map