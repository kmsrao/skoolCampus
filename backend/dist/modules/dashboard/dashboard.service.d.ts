import { PrismaService } from '../../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getAdminDashboard(branchId?: number): Promise<{
        counts: {
            totalStudents: number;
            totalStaff: number;
            monthlyAdmissions: number;
            totalVouchers: number;
            totalRoutes: number;
        };
        charts: {
            feesSummary: {
                months: string[];
                totalFee: any[];
                totalPaid: any[];
                totalDue: any[];
            };
            studentByClass: {
                name: string;
                value: number;
            }[];
            incomeVsExpense: {
                name: string;
                value: number;
            }[];
            weekendAttendance: {
                days: any[];
                studentAtt: any[];
                employeeAtt: any[];
            };
            monthlyAdmissionChart: number;
        };
    }>;
    getStudentDashboard(studentId: number): Promise<{
        message: string;
        enrollment?: undefined;
        attendanceSummary?: undefined;
        feeSummary?: undefined;
    } | {
        enrollment: {
            student: {
                id: number;
                email: string | null;
                mobileno: string | null;
                city: string | null;
                state: string | null;
                photo: string | null;
                branchId: number;
                createdAt: Date;
                updatedAt: Date;
                registerNo: string;
                admissionDate: Date | null;
                firstName: string;
                lastName: string;
                gender: string;
                birthday: Date | null;
                religion: string | null;
                caste: string | null;
                bloodGroup: string | null;
                motherTongue: string | null;
                currentAddress: string | null;
                permanentAddress: string | null;
                parentId: number;
                categoryId: number;
                routeId: number;
                vehicleId: number;
                hostelId: number;
                roomId: number;
                previousDetails: string | null;
            };
            class: {
                id: number;
                name: string;
                branchId: number;
                createdAt: Date;
                updatedAt: Date;
                nameNumeric: string | null;
                teacherId: number;
            };
            section: {
                id: number;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                classId: number;
                capacity: number;
            };
        } & {
            id: number;
            branchId: number;
            createdAt: Date;
            updatedAt: Date;
            studentId: number;
            classId: number;
            sectionId: number;
            sessionId: number;
            rollNo: string | null;
        };
        attendanceSummary: {
            present: number;
            absent: number;
            late: number;
        };
        feeSummary: {
            totalFee: number;
            totalPaid: number;
            totalDue: number;
        };
        message?: undefined;
    }>;
    getParentDashboard(parentId: number): Promise<{
        children: ({
            enrolls: ({
                class: {
                    id: number;
                    name: string;
                    branchId: number;
                    createdAt: Date;
                    updatedAt: Date;
                    nameNumeric: string | null;
                    teacherId: number;
                };
                section: {
                    id: number;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    classId: number;
                    capacity: number;
                };
            } & {
                id: number;
                branchId: number;
                createdAt: Date;
                updatedAt: Date;
                studentId: number;
                classId: number;
                sectionId: number;
                sessionId: number;
                rollNo: string | null;
            })[];
        } & {
            id: number;
            email: string | null;
            mobileno: string | null;
            city: string | null;
            state: string | null;
            photo: string | null;
            branchId: number;
            createdAt: Date;
            updatedAt: Date;
            registerNo: string;
            admissionDate: Date | null;
            firstName: string;
            lastName: string;
            gender: string;
            birthday: Date | null;
            religion: string | null;
            caste: string | null;
            bloodGroup: string | null;
            motherTongue: string | null;
            currentAddress: string | null;
            permanentAddress: string | null;
            parentId: number;
            categoryId: number;
            routeId: number;
            vehicleId: number;
            hostelId: number;
            roomId: number;
            previousDetails: string | null;
        })[];
    }>;
    private getActiveSessionId;
    private getTotalStudents;
    private getTotalStaff;
    private getMonthlyAdmissions;
    private getMonthlyVouchers;
    private getTotalRoutes;
    private getAnnualFeesSummary;
    private getStudentsByClass;
    private getIncomeVsExpense;
    private getWeekendAttendance;
    private getMonthlyAdmissionChart;
    private getStudentAttendanceSummary;
    private getStudentFeeSummary;
}
