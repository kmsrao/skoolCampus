import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const loginCredential = await this.prisma.loginCredential.findUnique({
      where: { username },
    });

    if (!loginCredential) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      loginCredential.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    return loginCredential;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    // Validate credentials
    const loginCredential = await this.validateUser(
      loginDto.username,
      loginDto.password,
    );

    if (!loginCredential) {
      throw new UnauthorizedException('Incorrect username or password');
    }

    // Check if account is active
    if (loginCredential.active !== 1) {
      throw new UnauthorizedException('Your account is inactive');
    }

    // Get user details based on role
    const userDetails = await this.prisma.getUserByRoleAndId(
      loginCredential.role,
      loginCredential.userId,
    );

    if (!userDetails) {
      throw new UnauthorizedException('User details not found');
    }

    const branchId = userDetails['branchId'] || userDetails['branch_id'] || null;

    // Check parent/student login permissions
    if (loginCredential.role === 6 && branchId) {
      // Parent
      const branch = await this.prisma.branch.findUnique({
        where: { id: branchId },
      });
      if (branch && branch.parentLogin === 0) {
        throw new UnauthorizedException('Parent login has been disabled');
      }
    } else if (loginCredential.role === 7 && branchId) {
      // Student
      const branch = await this.prisma.branch.findUnique({
        where: { id: branchId },
      });
      if (branch && branch.studentLogin === 0) {
        throw new UnauthorizedException('Student login has been disabled');
      }
    }

    // Determine user type
    let userType = 'staff';
    if (loginCredential.role === 1) {
      userType = 'superadmin';
    } else if (loginCredential.role === 6) {
      userType = 'parent';
    } else if (loginCredential.role === 7) {
      userType = 'student';
    }

    // Create JWT payload
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

    // Generate JWT token
    const accessToken = this.jwtService.sign(payload);

    // Update last login
    await this.prisma.loginCredential.update({
      where: { id: loginCredential.id },
      data: { lastLogin: new Date() },
    });

    // Log login activity
    await this.logLogin(
      loginCredential.userId,
      loginCredential.role,
      branchId,
    );

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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { username } = forgotPasswordDto;

    // Find user by username/email
    const loginCredential = await this.prisma.loginCredential.findUnique({
      where: { username },
    });

    if (!loginCredential) {
      // Don't reveal if user exists or not for security
      return { message: 'If your email exists in our system, you will receive a password reset link' };
    }

    // Get user details
    const userDetails = await this.prisma.getUserByRoleAndId(
      loginCredential.role,
      loginCredential.userId,
    );

    // Generate reset key
    const key = crypto
      .createHash('sha512')
      .update(
        `${loginCredential.role}${loginCredential.username}${Date.now()}${Math.random()}`,
      )
      .digest('hex');

    // Delete any existing reset tokens for this user
    await this.prisma.resetPassword.deleteMany({
      where: { loginCredentialId: loginCredential.id },
    });

    // Create new reset token
    await this.prisma.resetPassword.create({
      data: {
        key,
        loginCredentialId: loginCredential.id,
        username: loginCredential.username,
      },
    });

    // TODO: Send email with reset link
    // const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?key=${key}`;
    // await this.emailService.sendPasswordResetEmail(userDetails.email, resetUrl);

    console.log(`Password reset link: ${process.env.FRONTEND_URL}/auth/reset-password?key=${key}`);

    return { message: 'If your email exists in our system, you will receive a password reset link' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { key, password, confirmPassword } = resetPasswordDto;

    // Check if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Find reset token
    const resetToken = await this.prisma.resetPassword.findUnique({
      where: { key },
      include: { loginCredential: true },
    });

    if (!resetToken) {
      throw new NotFoundException('Invalid or expired reset token');
    }

    // Check if token is not older than 24 hours
    const tokenAge = Date.now() - resetToken.createdAt.getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (tokenAge > maxAge) {
      await this.prisma.resetPassword.delete({ where: { key } });
      throw new BadRequestException('Reset token has expired');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    await this.prisma.loginCredential.update({
      where: { id: resetToken.loginCredentialId },
      data: { password: hashedPassword },
    });

    // Delete reset token
    await this.prisma.resetPassword.delete({ where: { key } });

    return { message: 'Password reset successfully' };
  }

  private async logLogin(userId: number, role: number, branchId: number | null) {
    // Get user agent info (simplified version)
    const platform = 'Web'; // You can enhance this with actual user agent parsing
    const browser = 'Unknown';
    const ip = '127.0.0.1'; // You can get this from the request

    await this.prisma.loginLog.create({
      data: {
        userId,
        role,
        ip,
        platform,
        browser,
        timestamp: new Date(),
        branchId: branchId || 1, // Default to 1 if null
      },
    });
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
