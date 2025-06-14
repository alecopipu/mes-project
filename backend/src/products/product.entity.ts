import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { WorkOrder } from '../work-orders/work-order.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Index()
  @Column({ unique: true })
  sku: string;

  @OneToMany(() => WorkOrder, (workOrder) => workOrder.product)
  workOrders: WorkOrder[];
} 