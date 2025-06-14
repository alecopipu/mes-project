import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index, Check } from 'typeorm';
import { WorkOrder } from '../work-orders/work-order.entity';

@Entity()
@Check(`"status" IN ('pending', 'passed', 'failed')`)
export class QualityCheck {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WorkOrder, (workOrder) => workOrder.qualityChecks)
  workOrder: WorkOrder;

  @Column()
  checkName: string;

  @Index()
  @Column()
  status: string;

  @Column({ nullable: true })
  result: string;

  @CreateDateColumn()
  checkTime: Date;
} 