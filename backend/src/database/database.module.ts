import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedingService } from './seeding.service';
import { User } from '../users/user.entity';
import { Role } from '../permissions/role.entity';
import { Permission } from '../permissions/permission.entity';
import { Product } from '../products/product.entity';
import { Equipment } from '../equipment/equipment.entity';
import { Material } from '../materials/material.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      Product,
      Equipment,
      Material,
    ]),
  ],
  providers: [SeedingService],
})
export class DatabaseModule {} 