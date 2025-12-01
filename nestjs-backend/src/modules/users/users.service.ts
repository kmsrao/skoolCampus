import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number, role: number) {
    const user = await this.prisma.getUserByRoleAndId(role, userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get login credential
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

  async updateProfile(
    userId: number,
    role: number,
    updateProfileDto: UpdateProfileDto,
  ) {
    const { name, email, phone, address } = updateProfileDto;

    // Update based on role
    switch (role) {
      case 6: // Parent
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

      case 7: // Student
        // For students, name is split into first/last
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

      default: // Staff
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

  async changePassword(
    userId: number,
    role: number,
    changePasswordDto: ChangePasswordDto,
  ) {
    const { currentPassword, newPassword } = changePasswordDto;

    // Get login credential
    const loginCredential = await this.prisma.loginCredential.findFirst({
      where: {
        userId,
        role,
      },
    });

    if (!loginCredential) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      loginCredential.password,
    );

    if (!isPasswordValid) {
      throw new NotFoundException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.loginCredential.update({
      where: { id: loginCredential.id },
      data: {
        password: hashedPassword,
      },
    });

    return { message: 'Password changed successfully' };
  }
}
