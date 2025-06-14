import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { WorkOrder } from './work-order.entity';

@Entity()
export class ProductionLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WorkOrder, (workOrder) => workOrder.productionLogs)
  workOrder: WorkOrder;

  @Column()
  producedQuantity: number;

  @Column()
  defectiveQuantity: number;

  @CreateDateColumn()
  logTime: Date;
} 