import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Check,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Equipment } from '../equipment/equipment.entity';
import { ProductionLog } from './production-log.entity';
import { QualityCheck } from '../quality/quality-check.entity';
import { WorkOrderMaterial } from './work-order-material.entity';

@Entity()
@Check(`"status" IN ('pending', 'in-progress', 'completed', 'on-hold', 'cancelled')`)
export class WorkOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  orderNumber: string;

  @ManyToOne(() => Product, (product) => product.workOrders)
  product: Product;

  @Column()
  quantity: number;

  @Index()
  @Column()
  status: string;

  @Column({ type: 'timestamp' })
  scheduledStartDate: Date;

  @Column({ type: 'timestamp' })
  scheduledEndDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualStartDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualEndDate: Date;

  @ManyToOne(() => Equipment, (equipment) => equipment.workOrders)
  equipment: Equipment;

  @ManyToOne(() => User, (user) => user.id)
  createdBy: User;

  @OneToMany(() => ProductionLog, (log) => log.workOrder)
  productionLogs: ProductionLog[];

  @OneToMany(() => QualityCheck, (check) => check.workOrder)
  qualityChecks: QualityCheck[];

  @OneToMany(() => WorkOrderMaterial, (workOrderMaterial) => workOrderMaterial.workOrder)
  workOrderMaterials: WorkOrderMaterial[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 