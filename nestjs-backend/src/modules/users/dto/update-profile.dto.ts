import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '123 Main St, City' })
  @IsString()
  @IsOptional()
  address?: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'currentPass123' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'newPass123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  newPassword: string;

  @ApiProperty({ example: 'newPass123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  confirmPassword: string;
}
