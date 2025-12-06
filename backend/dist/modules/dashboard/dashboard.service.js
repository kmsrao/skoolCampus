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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAdminDashboard(branchId) {
        const sessionId = await this.getActiveSessionId();
        const totalStudents = await this.getTotalStudents(branchId, sessionId);
        const totalStaff = await this.getTotalStaff(branchId);
        const monthlyAdmissions = await this.getMonthlyAdmissions(branchId);
        const totalVouchers = await this.getMonthlyVouchers(branchId);
        const totalRoutes = await this.getTotalRoutes(branchId);
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
    async getStudentDashboard(studentId) {
        const sessionId = await this.getActiveSessionId();
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
        const attendanceSummary = await this.getStudentAttendanceSummary(enrollment.id);
        const feeSummary = await this.getStudentFeeSummary(studentId, sessionId);
        return {
            enrollment,
            attendanceSummary,
            feeSummary,
        };
    }
    async getParentDashboard(parentId) {
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
    async getActiveSessionId() {
        const settings = await this.prisma.globalSettings.findFirst();
        return settings?.sessionId || 1;
    }
    async getTotalStudents(branchId, sessionId) {
        return this.prisma.enroll.count({
            where: {
                ...(branchId && { branchId }),
                ...(sessionId && { sessionId }),
            },
        });
    }
    async getTotalStaff(branchId) {
        return this.prisma.staff.count({
            where: {
                ...(branchId && { branchId }),
            },
        });
    }
    async getMonthlyAdmissions(branchId) {
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
    async getMonthlyVouchers(branchId) {
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
    async getTotalRoutes(branchId) {
        return 0;
    }
    async getAnnualFeesSummary(branchId, sessionId) {
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        const currentYear = new Date().getFullYear();
        const totalFee = [];
        const totalPaid = [];
        const totalDue = [];
        for (const month of months) {
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
    async getStudentsByClass(branchId, sessionId) {
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
        const data = await Promise.all(result.map(async (item) => {
            const classInfo = await this.prisma.class.findUnique({
                where: { id: item.classId },
            });
            return {
                name: classInfo?.name || 'Unknown',
                value: item._count.studentId,
            };
        }));
        return data;
    }
    async getIncomeVsExpense(branchId) {
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
    async getWeekendAttendance(branchId) {
        const days = [];
        const studentAtt = [];
        const employeeAtt = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            const studentCount = await this.prisma.studentAttendance.count({
                where: {
                    date: date,
                    status: {
                        in: ['P', 'L'],
                    },
                    ...(branchId && { branchId }),
                },
            });
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
    async getMonthlyAdmissionChart(branchId) {
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
    async getStudentAttendanceSummary(enrollId) {
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
    async getStudentFeeSummary(studentId, sessionId) {
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
        const totalPaid = allocation.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
        return {
            totalFee: 0,
            totalPaid,
            totalDue: 0,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map