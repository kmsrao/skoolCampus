import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';
import {
  CurrentUser,
  CurrentUserData,
} from '../../common/decorators/current-user.decorator';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get dashboard data based on user role' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDashboard(@CurrentUser() user: CurrentUserData) {
    // Return dashboard based on user type
    if (user.userType === 'student') {
      return this.dashboardService.getStudentDashboard(user.userId);
    } else if (user.userType === 'parent') {
      return this.dashboardService.getParentDashboard(user.userId);
    } else {
      // Admin/Staff/Superadmin dashboard
      return this.dashboardService.getAdminDashboard(user.branchId);
    }
  }

  @Get('admin')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get admin dashboard with optional branch filter' })
  @ApiQuery({ name: 'branchId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Admin dashboard data' })
  async getAdminDashboard(
    @CurrentUser() user: CurrentUserData,
    @Query('branchId') branchId?: number,
  ) {
    // Superadmin can view any branch, others only their own
    const effectiveBranchId =
      user.role === UserRole.SUPERADMIN
        ? branchId
        : user.branchId;

    return this.dashboardService.getAdminDashboard(effectiveBranchId);
  }

  @Get('student')
  @Roles(UserRole.STUDENT, UserRole.PARENT)
  @ApiOperation({ summary: 'Get student dashboard' })
  @ApiQuery({ name: 'studentId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Student dashboard data' })
  async getStudentDashboard(
    @CurrentUser() user: CurrentUserData,
    @Query('studentId') studentId?: number,
  ) {
    // Parents can view specific child, students view their own
    const effectiveStudentId =
      user.role === UserRole.PARENT && studentId
        ? studentId
        : user.userId;

    return this.dashboardService.getStudentDashboard(effectiveStudentId);
  }

  @Get('parent')
  @Roles(UserRole.PARENT)
  @ApiOperation({ summary: 'Get parent dashboard with all children' })
  @ApiResponse({ status: 200, description: 'Parent dashboard data' })
  async getParentDashboard(@CurrentUser() user: CurrentUserData) {
    return this.dashboardService.getParentDashboard(user.userId);
  }
}
