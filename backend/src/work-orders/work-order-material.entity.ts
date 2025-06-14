import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { WorkOrder } from './work-order.entity';
import { Material } from '../materials/material.entity';

@Entity()
export class WorkOrderMaterial {
  @PrimaryColumn()
  workOrderId: number;

  @PrimaryColumn()
  materialId: number;

  @Column()
  requiredQuantity: number;

  @ManyToOne(() => WorkOrder, (workOrder) => workOrder.workOrderMaterials)
  workOrder: WorkOrder;

  @ManyToOne(() => Material, (material) => material.workOrderMaterials)
  material: Material;
} 