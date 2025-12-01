import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@ramom.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  username: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    example: 'abc123def456...',
    description: 'Password reset token',
  })
  @IsString()
  @IsNotEmpty({ message: 'Reset key is required' })
  key: string;

  @ApiProperty({
    example: 'newPassword123',
    description: 'New password (minimum 4 characters)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(4, { message: 'Password must be at least 4 characters' })
  password: string;

  @ApiProperty({
    example: 'newPassword123',
    description: 'Password confirmation',
  })
  @IsString()
  @IsNotEmpty({ message: 'Confirm password is required' })
  @MinLength(4, { message: 'Confirm password must be at least 4 characters' })
  confirmPassword: string;
}
