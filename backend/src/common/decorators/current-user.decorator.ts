import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserData {
  id: number;
  userId: number;
  username: string;
  role: number;
  branchId: number;
  name: string;
  photo: string;
  userType: string; // 'superadmin' | 'staff' | 'parent' | 'student'
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserData => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
