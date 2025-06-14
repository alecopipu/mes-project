import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { Permissions } from './decorators/permissions.decorator';
import { Permission } from '../permissions/enums/permission.enum';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  @Roles(Role.Admin)
  @Permissions(Permission.ManageUsers)
  getProfile(@Request() req) {
    return req.user;
  }
} 