import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Index } from 'typeorm';
import { Role } from '../permissions/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('simple-array', { nullable: true })
  skills: string[];

  @Column({ nullable: true })
  shift: string;

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable()
  roles: Role[];
} 