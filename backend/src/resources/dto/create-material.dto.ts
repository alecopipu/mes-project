import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  unit: string;
} 