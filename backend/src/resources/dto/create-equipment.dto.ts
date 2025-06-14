import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max, IsIn } from 'class-validator';

const validStatuses = ['operational', 'under-maintenance', 'out-of-service'] as const;
type EquipmentStatus = typeof validStatuses[number];

export class CreateEquipmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsIn(validStatuses)
  status: EquipmentStatus;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  availability?: number;
} 