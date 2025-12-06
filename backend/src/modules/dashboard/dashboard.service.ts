import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getAdminDashboard(branchId?: number) {
    const sessionId = await this.getActiveSessionId();

    // Get counts
    const totalStudents = await this.getTotalStudents(branchId, sessionId);
    const totalStaff = await this.getTotalStaff(branchId);
    const monthlyAdmissions = await this.getMonthlyAdmissions(branchId);
    const totalVouchers = await this.getMonthlyVouchers(branchId);
    const totalRoutes = await this.getTotalRoutes(branchId);

    // Get chart data
    const feesSummary = await this.getAnnualFeesSummary(branchId, sessionId);
    const studentByClass = await this.getStudentsByClass(branchId, sessionId);
    const incomeVsExpense = await this.getIncomeVsExpense(branchId);
    const weekendAttendance = await this.getWeekendAttendance(branchId);
    const monthlyAdmissionChart = await this.getMonthlyAdmissionChart(branchId);

    return {
      counts: {
        totalStudents,
        totalStaff,
        monthlyAdmissions,
        totalVouchers,
        totalRoutes,
      },
      charts: {
        feesSummary,
        studentByClass,
        incomeVsExpense,
        weekendAttendance,
        monthlyAdmissionChart,
      },
    };
  }

  async getStudentDashboard(studentId: number) {
    const sessionId = await this.getActiveSessionId();

    // Get student enrollment
    const enrollment = await this.prisma.enroll.findFirst({
      where: {
        studentId,
        sessionId,
      },
      include: {
        student: true,
        class: true,
        section: true,
      },
    });

    if (!enrollment) {
      return {
        message: 'No active enrollment found',
      };
    }

    // Get attendance summary
    const attendanceSummary = await this.getStudentAttendanceSummary(
      enrollment.id,
    );

    // Get fee summary
    const feeSummary = await this.getStudentFeeSummary(studentId, sessionId);

    return {
      enrollment,
      attendanceSummary,
      feeSummary,
    };
  }

  async getParentDashboard(parentId: number) {
    // Get all children
    const children = await this.prisma.student.findMany({
      where: { parentId },
      include: {
        enrolls: {
          where: {
            sessionId: await this.getActiveSessionId(),
          },
          include: {
            class: true,
            section: true,
          },
        },
      },
    });

    return {
      children,
    };
  }

  // Helper methods
  private async getActiveSessionId(): Promise<number> {
    const settings = await this.prisma.globalSettings.findFirst();
    return settings?.sessionId || 1;
  }

  private async getTotalStudents(
    branchId?: number,
    sessionId?: number,
  ): Promise<number> {
    return this.prisma.enroll.count({
      where: {
        ...(branchId && { branchId }),
        ...(sessionId && { sessionId }),
      },
    });
  }

  private async getTotalStaff(branchId?: number): Promise<number> {
    return this.prisma.staff.count({
      where: {
        ...(branchId && { branchId }),
      },
    });
  }

  private async getMonthlyAdmissions(branchId?: number): Promise<number> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return this.prisma.student.count({
      where: {
        admissionDate: {
          gte: oneMonthAgo,
        },
        ...(branchId && { branchId }),
      },
    });
  }

  private async getMonthlyVouchers(branchId?: number): Promise<number> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return this.prisma.transaction.count({
      where: {
        date: {
          gte: oneMonthAgo,
        },
        ...(branchId && { branchId }),
      },
    });
  }

  private async getTotalRoutes(branchId?: number): Promise<number> {
    // This would require transport_route table
    // For now, return 0
    return 0;
  }

  private async getAnnualFeesSummary(branchId?: number, sessionId?: number) {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();

    const totalFee = [];
    const totalPaid = [];
    const totalDue = [];

    for (const month of months) {
      // This is a simplified version
      // You would need to implement the complex fee calculation logic
      totalFee.push(0);
      totalPaid.push(0);
      totalDue.push(0);
    }

    return {
      months: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      totalFee,
      totalPaid,
      totalDue,
    };
  }

  private async getStudentsByClass(branchId?: number, sessionId?: number) {
    const result = await this.prisma.enroll.groupBy({
      by: ['classId'],
      where: {
        ...(branchId && { branchId }),
        ...(sessionId && { sessionId }),
      },
      _count: {
        studentId: true,
      },
    });

    const data = await Promise.all(
      result.map(async (item) => {
        const classInfo = await this.prisma.class.findUnique({
          where: { id: item.classId },
        });
        return {
          name: classInfo?.name || 'Unknown',
          value: item._count.studentId,
        };
      }),
    );

    return data;
  }

  private async getIncomeVsExpense(branchId?: number) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const result = await this.prisma.transaction.aggregate({
      where: {
        date: {
          gte: new Date(currentYear, currentMonth - 1, 1),
          lt: new Date(currentYear, currentMonth, 1),
        },
        ...(branchId && { branchId }),
      },
      _sum: {
        dr: true,
        cr: true,
      },
    });

    return [
      {
        name: 'Expense',
        value: Number(result._sum.dr) || 0,
      },
      {
        name: 'Income',
        value: Number(result._sum.cr) || 0,
      },
    ];
  }

  private async getWeekendAttendance(branchId?: number) {
    const days = [];
    const studentAtt = [];
    const employeeAtt = [];

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      days.push(
        date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      );

      // Student attendance
      const studentCount = await this.prisma.studentAttendance.count({
        where: {
          date: date,
          status: {
            in: ['P', 'L'],
          },
          ...(branchId && { branchId }),
        },
      });

      // Staff attendance
      const staffCount = await this.prisma.staffAttendance.count({
        where: {
          date: date,
          status: {
            in: ['P', 'L'],
          },
          ...(branchId && { branchId }),
        },
      });

      studentAtt.push({ y: studentCount });
      employeeAtt.push({ y: staffCount });
    }

    return {
      days,
      studentAtt,
      employeeAtt,
    };
  }

  private async getMonthlyAdmissionChart(branchId?: number) {
    // Return count of admissions in last 30 days
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const count = await this.prisma.student.count({
      where: {
        admissionDate: {
          gte: oneMonthAgo,
        },
        ...(branchId && { branchId }),
      },
    });

    return count;
  }

  private async getStudentAttendanceSummary(enrollId: number) {
    const currentYear = new Date().getFullYear();

    const present = await this.prisma.studentAttendance.count({
      where: {
        enrollId,
        status: 'P',
        date: {
          gte: new Date(currentYear, 0, 1),
        },
      },
    });

    const absent = await this.prisma.studentAttendance.count({
      where: {
        enrollId,
        status: 'A',
        date: {
          gte: new Date(currentYear, 0, 1),
        },
      },
    });

    const late = await this.prisma.studentAttendance.count({
      where: {
        enrollId,
        status: 'L',
        date: {
          gte: new Date(currentYear, 0, 1),
        },
      },
    });

    return {
      present,
      absent,
      late,
    };
  }

  private async getStudentFeeSummary(studentId: number, sessionId: number) {
    const allocation = await this.prisma.feeAllocation.findFirst({
      where: {
        studentId,
        sessionId,
      },
      include: {
        payments: true,
      },
    });

    if (!allocation) {
      return {
        totalFee: 0,
        totalPaid: 0,
        totalDue: 0,
      };
    }

    const totalPaid = allocation.payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    return {
      totalFee: 0, // Would need fee_groups_details calculation
      totalPaid,
      totalDue: 0,
    };
  }
}
