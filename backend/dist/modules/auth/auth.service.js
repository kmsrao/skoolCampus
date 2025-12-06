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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(username, password) {
        const loginCredential = await this.prisma.loginCredential.findUnique({
            where: { username },
        });
        if (!loginCredential) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, loginCredential.password);
        if (!isPasswordValid) {
            return null;
        }
        return loginCredential;
    }
    async login(loginDto) {
        const loginCredential = await this.validateUser(loginDto.username, loginDto.password);
        if (!loginCredential) {
            throw new common_1.UnauthorizedException('Incorrect username or password');
        }
        if (loginCredential.active !== 1) {
            throw new common_1.UnauthorizedException('Your account is inactive');
        }
        const userDetails = await this.prisma.getUserByRoleAndId(loginCredential.role, loginCredential.userId);
        if (!userDetails) {
            throw new common_1.UnauthorizedException('User details not found');
        }
        const branchId = userDetails['branchId'] || userDetails['branch_id'] || null;
        if (loginCredential.role === 6 && branchId) {
            const branch = await this.prisma.branch.findUnique({
                where: { id: branchId },
            });
            if (branch && branch.parentLogin === 0) {
                throw new common_1.UnauthorizedException('Parent login has been disabled');
            }
        }
        else if (loginCredential.role === 7 && branchId) {
            const branch = await this.prisma.branch.findUnique({
                where: { id: branchId },
            });
            if (branch && branch.studentLogin === 0) {
                throw new common_1.UnauthorizedException('Student login has been disabled');
            }
        }
        let userType = 'staff';
        if (loginCredential.role === 1) {
            userType = 'superadmin';
        }
        else if (loginCredential.role === 6) {
            userType = 'parent';
        }
        else if (loginCredential.role === 7) {
            userType = 'student';
        }
        const payload = {
            sub: loginCredential.id,
            userId: loginCredential.userId,
            username: loginCredential.username,
            role: loginCredential.role,
            branchId: branchId,
            name: userDetails.name,
            photo: userDetails.photo,
            userType: userType,
        };
        const accessToken = this.jwtService.sign(payload);
        await this.prisma.loginCredential.update({
            where: { id: loginCredential.id },
            data: { lastLogin: new Date() },
        });
        await this.logLogin(loginCredential.userId, loginCredential.role, branchId);
        return {
            accessToken,
            user: {
                id: loginCredential.id,
                userId: loginCredential.userId,
                username: loginCredential.username,
                role: loginCredential.role,
                name: userDetails.name,
                photo: userDetails.photo,
                branchId: branchId,
                userType: userType,
            },
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const { username } = forgotPasswordDto;
        const loginCredential = await this.prisma.loginCredential.findUnique({
            where: { username },
        });
        if (!loginCredential) {
            return { message: 'If your email exists in our system, you will receive a password reset link' };
        }
        const userDetails = await this.prisma.getUserByRoleAndId(loginCredential.role, loginCredential.userId);
        const key = crypto
            .createHash('sha512')
            .update(`${loginCredential.role}${loginCredential.username}${Date.now()}${Math.random()}`)
            .digest('hex');
        await this.prisma.resetPassword.deleteMany({
            where: { loginCredentialId: loginCredential.id },
        });
        await this.prisma.resetPassword.create({
            data: {
                key,
                loginCredentialId: loginCredential.id,
                username: loginCredential.username,
            },
        });
        console.log(`Password reset link: ${process.env.FRONTEND_URL}/auth/reset-password?key=${key}`);
        return { message: 'If your email exists in our system, you will receive a password reset link' };
    }
    async resetPassword(resetPasswordDto) {
        const { key, password, confirmPassword } = resetPasswordDto;
        if (password !== confirmPassword) {
            throw new common_1.BadRequestException('Passwords do not match');
        }
        const resetToken = await this.prisma.resetPassword.findUnique({
            where: { key },
            include: { loginCredential: true },
        });
        if (!resetToken) {
            throw new common_1.NotFoundException('Invalid or expired reset token');
        }
        const tokenAge = Date.now() - resetToken.createdAt.getTime();
        const maxAge = 24 * 60 * 60 * 1000;
        if (tokenAge > maxAge) {
            await this.prisma.resetPassword.delete({ where: { key } });
            throw new common_1.BadRequestException('Reset token has expired');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.prisma.loginCredential.update({
            where: { id: resetToken.loginCredentialId },
            data: { password: hashedPassword },
        });
        await this.prisma.resetPassword.delete({ where: { key } });
        return { message: 'Password reset successfully' };
    }
    async logLogin(userId, role, branchId) {
        const platform = 'Web';
        const browser = 'Unknown';
        const ip = '127.0.0.1';
        await this.prisma.loginLog.create({
            data: {
                userId,
                role,
                ip,
                platform,
                browser,
                timestamp: new Date(),
                branchId: branchId || 1,
            },
        });
    }
    async verifyToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map