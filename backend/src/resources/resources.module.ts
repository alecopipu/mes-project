import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { Equipment } from '../equipment/equipment.entity';
import { User } from '../users/user.entity';
import { Material } from '../materials/material.entity';
import { Role } from '../permissions/role.entity';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Equipment, User, Material, Role]),
    EventsModule,
  ],
  providers: [ResourcesService],
  controllers: [ResourcesController],
})
export class ResourcesModule {} 