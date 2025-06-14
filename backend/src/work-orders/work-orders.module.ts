import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrder } from './work-order.entity';
import { ProductionLog } from './production-log.entity';
import { WorkOrderMaterial } from './work-order-material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkOrder, ProductionLog, WorkOrderMaterial])],
})
export class WorkOrdersModule {} 