import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../permissions/enums/permission.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  // --- Equipment Endpoints ---
  @Post('equipment')
  @Roles(Role.Admin, Role.ProductionManager)
  @Permissions(Permission.ManageEquipment)
  createEquipment(@Body() createEquipmentDto: CreateEquipmentDto) {
    return this.resourcesService.createEquipment(createEquipmentDto);
  }

  @Get('equipment')
  findAllEquipment() {
    return this.resourcesService.findAllEquipment();
  }

  @Get('equipment/:id')
  findOneEquipment(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.findOneEquipment(id);
  }

  @Patch('equipment/:id')
  @Roles(Role.Admin, Role.ProductionManager, Role.MaintenanceTechnician)
  @Permissions(Permission.ManageEquipment)
  updateEquipment(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
  ) {
    return this.resourcesService.updateEquipment(id, updateEquipmentDto);
  }

  @Delete('equipment/:id')
  @Roles(Role.Admin, Role.ProductionManager)
  @Permissions(Permission.ManageEquipment)
  removeEquipment(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.removeEquipment(id);
  }

  // --- Users (Personnel) Endpoints ---
  @Post('users')
  @Roles(Role.Admin)
  @Permissions(Permission.ManageUsers)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.resourcesService.createUser(createUserDto);
  }

  @Get('users')
  @Roles(Role.Admin, Role.ProductionManager)
  findAllUsers() {
    return this.resourcesService.findAllUsers();
  }

  @Get('users/:id')
  @Roles(Role.Admin, Role.ProductionManager)
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.findOneUser(id);
  }

  @Patch('users/:id')
  @Roles(Role.Admin)
  @Permissions(Permission.ManageUsers)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.resourcesService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  @Roles(Role.Admin)
  @Permissions(Permission.ManageUsers)
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.removeUser(id);
  }

  // --- Materials Endpoints ---
  @Post('materials')
  @Roles(Role.Admin, Role.ProductionManager)
  @Permissions(Permission.ManageMaterials)
  createMaterial(@Body() createMaterialDto: CreateMaterialDto) {
    return this.resourcesService.createMaterial(createMaterialDto);
  }

  @Get('materials')
  findAllMaterials() {
    return this.resourcesService.findAllMaterials();
  }

  @Get('materials/:id')
  findOneMaterial(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.findOneMaterial(id);
  }

  @Patch('materials/:id')
  @Roles(Role.Admin, Role.ProductionManager)
  @Permissions(Permission.ManageMaterials)
  updateMaterial(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    return this.resourcesService.updateMaterial(id, updateMaterialDto);
  }

  @Delete('materials/:id')
  @Roles(Role.Admin, Role.ProductionManager)
  @Permissions(Permission.ManageMaterials)
  removeMaterial(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.removeMaterial(id);
  }
} 