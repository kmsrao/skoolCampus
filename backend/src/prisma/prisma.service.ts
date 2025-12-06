import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Helper method to get user by role
  async getUserByRoleAndId(role: number, userId: number) {
    switch (role) {
      case 1: // Superadmin
        return {
          name: 'Superadmin',
          photo: null,
          branch_id: null,
          email: null,
        };
      case 6: // Parent
        return await this.parent.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            photo: true,
            branchId: true,
          },
        });
      case 7: // Student
        return await this.student.findUnique({
          where: { id: userId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            photo: true,
            branchId: true,
          },
        }).then(student => student ? {
          ...student,
          name: `${student.firstName} ${student.lastName}`,
        } : null);
      default: // Staff (Teacher, Admin, etc.)
        return await this.staff.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            photo: true,
            branchId: true,
          },
        });
    }
  }
}
