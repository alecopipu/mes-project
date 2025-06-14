import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, Check } from 'typeorm';
import { WorkOrder } from '../work-orders/work-order.entity';

@Entity()
@Check(`"status" IN ('operational', 'under-maintenance', 'out-of-service')`)
export class Equipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  status: string;

  @Column('float', { nullable: true })
  capacity: number;

  @Column('float', { default: 1.0 })
  availability: number;

  @OneToMany(() => WorkOrder, (workOrder) => workOrder.equipment)
  workOrders: WorkOrder[];
} 