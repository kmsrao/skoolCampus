import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Verify user still exists and is active
    const user = await this.prisma.loginCredential.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.active !== 1) {
      throw new UnauthorizedException('Invalid or inactive account');
    }

    return {
      id: payload.sub,
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
      branchId: payload.branchId,
      name: payload.name,
      photo: payload.photo,
      userType: payload.userType,
    };
  }
}
