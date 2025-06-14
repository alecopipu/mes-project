import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Equipment } from '../equipment/equipment.entity';
import { User } from '../users/user.entity';
import { Material } from '../materials/material.entity';
import { Role } from '../permissions/role.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import * as bcrypt from 'bcrypt';
import { Role as RoleEnum } from '../users/enums/role.enum';
import { EventsGateway } from '../events/events.gateway';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ResourcesService {
  private readonly logger = new Logger(ResourcesService.name);

  constructor(
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Material)
    private materialsRepository: Repository<Material>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private eventsGateway: EventsGateway,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    this.logger.debug('Running a scheduled task to check resource status...');
    // In a real application, you would put logic here, for example:
    // const equipments = await this.findAllEquipment();
    // equipments.forEach(eq => { /* check status and maybe fire an event */ });
  }

  // --- Equipment ---
  createEquipment(createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    const equipment = this.equipmentRepository.create(createEquipmentDto);
    return this.equipmentRepository.save(equipment);
  }

  findAllEquipment(): Promise<Equipment[]> {
    return this.equipmentRepository.find();
  }

  async findOneEquipment(id: number): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOneBy({ id });
    if (!equipment) {
      throw new NotFoundException(`Equipment with ID "${id}" not found`);
    }
    return equipment;
  }

  async updateEquipment(id: number, updateEquipmentDto: UpdateEquipmentDto): Promise<Equipment> {
    const equipment = await this.equipmentRepository.preload({
      id: id,
      ...updateEquipmentDto,
    });
    if (!equipment) {
      throw new NotFoundException(`Equipment with ID "${id}" not found`);
    }
    const updatedEquipment = await this.equipmentRepository.save(equipment);
    this.eventsGateway.server.emit('equipment_updated', updatedEquipment);
    return updatedEquipment;
  }

  async removeEquipment(id: number): Promise<void> {
    const result = await this.equipmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Equipment with ID "${id}" not found`);
    }
  }

  // --- Users (Personnel) ---
  async createUser(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { roles: roleNames, ...restOfDto } = createUserDto;
    
    const roles = await this.rolesRepository.findBy({ name: In(roleNames) });
    if (roles.length !== roleNames.length) {
        throw new BadRequestException('One or more roles are invalid.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(restOfDto.password, salt);
    
    const user = this.usersRepository.create({
        ...restOfDto,
        password: hashedPassword,
        roles: roles,
    });

    const savedUser = await this.usersRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = savedUser;
    return result;
  }

  findAllUsers(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['roles', 'roles.permissions'] });
  }

  async findOneUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id }, relations: ['roles', 'roles.permissions'] });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { roles: roleNames, ...restOfDto } = updateUserDto;
    
    const updatePayload: Partial<User> = { ...restOfDto };

    if (roleNames) {
        const roles = await this.rolesRepository.findBy({ name: In(roleNames) });
        if (roles.length !== roleNames.length) {
            throw new BadRequestException('One or more roles are invalid.');
        }
        updatePayload.roles = roles;
    }

    if (updatePayload.password) {
        const salt = await bcrypt.genSalt();
        updatePayload.password = await bcrypt.hash(updatePayload.password, salt);
    }

    const user = await this.usersRepository.preload({
      id: id,
      ...updatePayload,
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    const updatedUser = await this.usersRepository.save(user);
    this.eventsGateway.server.emit('user_updated', updatedUser);
    return updatedUser;
  }

  async removeUser(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }

  // --- Materials ---
  createMaterial(createMaterialDto: CreateMaterialDto): Promise<Material> {
    const material = this.materialsRepository.create(createMaterialDto);
    return this.materialsRepository.save(material);
  }

  findAllMaterials(): Promise<Material[]> {
    return this.materialsRepository.find();
  }

  async findOneMaterial(id: number): Promise<Material> {
    const material = await this.materialsRepository.findOneBy({ id });
    if (!material) {
      throw new NotFoundException(`Material with ID "${id}" not found`);
    }
    return material;
  }

  async updateMaterial(id: number, updateMaterialDto: UpdateMaterialDto): Promise<Material> {
    const material = await this.materialsRepository.preload({
      id: id,
      ...updateMaterialDto,
    });
    if (!material) {
      throw new NotFoundException(`Material with ID "${id}" not found`);
    }
    const updatedMaterial = await this.materialsRepository.save(material);
    this.eventsGateway.server.emit('material_updated', updatedMaterial);
    return updatedMaterial;
  }

  async removeMaterial(id: number): Promise<void> {
    const result = await this.materialsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Material with ID "${id}" not found`);
    }
  }
} 