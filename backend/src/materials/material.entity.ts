import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { WorkOrderMaterial } from '../work-orders/work-order-material.entity';

@Entity()
export class Material {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  sku: string;

  @Column({ type: 'int' })
  quantityInStock: number;

  @OneToMany(() => WorkOrderMaterial, (workOrderMaterial) => workOrderMaterial.material)
  workOrderMaterials: WorkOrderMaterial[];
} 