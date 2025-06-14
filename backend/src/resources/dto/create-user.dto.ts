import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional, IsArray, IsBoolean, IsEnum } from 'class-validator';
import { Role } from '../../users/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  shift?: string;

  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];
} 