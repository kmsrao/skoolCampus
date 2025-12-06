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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dashboard_service_1 = require("./dashboard.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getDashboard(user) {
        if (user.userType === 'student') {
            return this.dashboardService.getStudentDashboard(user.userId);
        }
        else if (user.userType === 'parent') {
            return this.dashboardService.getParentDashboard(user.userId);
        }
        else {
            return this.dashboardService.getAdminDashboard(user.branchId);
        }
    }
    async getAdminDashboard(user, branchId) {
        const effectiveBranchId = user.role === roles_decorator_1.UserRole.SUPERADMIN
            ? branchId
            : user.branchId;
        return this.dashboardService.getAdminDashboard(effectiveBranchId);
    }
    async getStudentDashboard(user, studentId) {
        const effectiveStudentId = user.role === roles_decorator_1.UserRole.PARENT && studentId
            ? studentId
            : user.userId;
        return this.dashboardService.getStudentDashboard(effectiveStudentId);
    }
    async getParentDashboard(user) {
        return this.dashboardService.getParentDashboard(user.userId);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard data based on user role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard data retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.SUPERADMIN, roles_decorator_1.UserRole.ADMIN, roles_decorator_1.UserRole.TEACHER),
    (0, swagger_1.ApiOperation)({ summary: 'Get admin dashboard with optional branch filter' }),
    (0, swagger_1.ApiQuery)({ name: 'branchId', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin dashboard data' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAdminDashboard", null);
__decorate([
    (0, common_1.Get)('student'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.STUDENT, roles_decorator_1.UserRole.PARENT),
    (0, swagger_1.ApiOperation)({ summary: 'Get student dashboard' }),
    (0, swagger_1.ApiQuery)({ name: 'studentId', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Student dashboard data' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStudentDashboard", null);
__decorate([
    (0, common_1.Get)('parent'),
    (0, roles_decorator_1.Roles)(roles_decorator_1.UserRole.PARENT),
    (0, swagger_1.ApiOperation)({ summary: 'Get parent dashboard with all children' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Parent dashboard data' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getParentDashboard", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, common_1.Controller)('dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map