import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Role } from '../permissions/role.entity';
import { Permission } from '../permissions/permission.entity';
import { Product } from '../products/product.entity';
import { Equipment } from '../equipment/equipment.entity';
import { Material } from '../materials/material.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedingService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    const permissions = await this.seedPermissions();
    const roles = await this.seedRoles(permissions);
    await this.seedUsers(roles);
    await this.seedProducts();
    await this.seedEquipment();
    await this.seedMaterials();
  }

  private async seedPermissions(): Promise<Permission[]> {
    const existingPermissions = await this.permissionRepository.find();
    if (existingPermissions.length > 0) {
      return existingPermissions;
    }

    const permissionsToCreate = [
      { name: 'manage_users', description: 'Create, edit, and delete user accounts.' },
      { name: 'manage_roles', description: 'Create, edit, and delete roles and assign permissions.' },
      { name: 'manage_products', description: 'Add, edit, and delete product definitions.' },
      { name: 'manage_equipment', description: 'Add, edit, and delete equipment records.' },
      { name: 'manage_materials', description: 'Add, edit, and delete material records.' },
      { name: 'manage_work_orders', description: 'Create, schedule, and manage production work orders.' },
      { name: 'execute_work_orders', description: 'Start, pause, and complete steps in a work order.' },
      { name: 'log_production_data', description: 'Enter production counts, scrap, and downtime.' },
      { name: 'perform_quality_check', description: 'Execute quality control checks and record results.' },
      { name: 'view_reports', description: 'View production dashboards and performance reports.' },
    ];

    const newPermissions = this.permissionRepository.create(permissionsToCreate);
    return this.permissionRepository.save(newPermissions);
  }

  private async seedRoles(permissions: Permission[]): Promise<Role[]> {
    const existingRoles = await this.roleRepository.find({ relations: ['permissions'] });
    if (existingRoles.length > 0) {
      return existingRoles;
    }

    const allPermissions = permissions;
    const managerPermissions = permissions.filter(p => [
        'manage_products', 'manage_equipment', 'manage_materials', 
        'manage_work_orders', 'execute_work_orders', 'log_production_data', 'view_reports'
    ].includes(p.name));
    const inspectorPermissions = permissions.filter(p => ['perform_quality_check', 'view_reports'].includes(p.name));
    const operatorPermissions = permissions.filter(p => ['execute_work_orders', 'log_production_data', 'view_reports'].includes(p.name));


    const rolesToCreate = [
      { name: 'Admin', permissions: allPermissions },
      { name: 'Production Manager', permissions: managerPermissions },
      { name: 'Quality Inspector', permissions: inspectorPermissions },
      { name: 'Operator', permissions: operatorPermissions },
    ];
    
    const newRoles = this.roleRepository.create(rolesToCreate);
    return this.roleRepository.save(newRoles);
  }

  private async seedUsers(roles: Role[]) {
    const userCount = await this.userRepository.count();
    if (userCount > 0) {
      return;
    }

    const adminRole = roles.find(r => r.name === 'Admin');
    const managerRole = roles.find(r => r.name === 'Production Manager');
    const inspectorRole = roles.find(r => r.name === 'Quality Inspector');
    const operatorRole = roles.find(r => r.name === 'Operator');

    if (!adminRole || !managerRole || !inspectorRole || !operatorRole) {
      throw new Error('One or more roles not found. Seeding cannot proceed.');
    }
    const salt = await bcrypt.genSalt();
    
    const usersToCreate = [
      {
        username: 'admin',
        password: await bcrypt.hash('admin', salt),
        firstName: 'Admin',
        lastName: 'User',
        roles: [adminRole],
      },
      {
        username: 'manager',
        password: await bcrypt.hash('password', salt),
        firstName: 'Manager',
        lastName: 'User',
        roles: [managerRole],
      },
      {
        username: 'inspector',
        password: await bcrypt.hash('password', salt),
        firstName: 'Inspector',
        lastName: 'User',
        roles: [inspectorRole],
      },
      {
        username: 'operator',
        password: await bcrypt.hash('password', salt),
        firstName: 'Operator',
        lastName: 'User',
        roles: [operatorRole],
      },
    ];

    const newUsers = this.userRepository.create(usersToCreate);
    await this.userRepository.save(newUsers);
  }

  private async seedProducts() {
    const productCount = await this.productRepository.count();
    if (productCount > 0) return;

    const products = [
      { name: 'Laptop Model X', sku: 'LP-MDL-X-2024' },
      { name: 'Smartphone Model Y', sku: 'SP-MDL-Y-2024' },
    ];
    await this.productRepository.save(this.productRepository.create(products));
  }

  private async seedEquipment() {
    const equipmentCount = await this.equipmentRepository.count();
    if (equipmentCount > 0) return;

    const equipment = [
      { name: 'Assembly Line 1', type: 'Assembly', status: 'operational' },
      { name: 'CNC Machine A', type: 'Machining', status: 'operational' },
    ];
    await this.equipmentRepository.save(this.equipmentRepository.create(equipment));
  }

  private async seedMaterials() {
    const materialCount = await this.materialRepository.count();
    if (materialCount > 0) return;

    const materials = [
      { name: '15-inch Screen', sku: 'SCR-15-GENERIC', quantityInStock: 500 },
      { name: 'CPU Chipset v3', sku: 'CPU-V3-INTEL', quantityInStock: 1000 },
    ];
    await this.materialRepository.save(this.materialRepository.create(materials));
  }
} 