import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Role as RoleEntity } from '../permissions/role.entity';
import { Permission as PermissionEntity } from '../permissions/permission.entity';
import { Role } from '../users/enums/role.enum';
import { Permission } from '../permissions/enums/permission.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        JwtService,
        ConfigService,
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: getRepositoryToken(RoleEntity), useValue: {} },
        { provide: getRepositoryToken(PermissionEntity), useValue: {} },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const result = { access_token: 'some_jwt_token' };
      const req = { user: { username: 'testuser' } };
      jest.spyOn(authService, 'login').mockImplementation(async () => result);

      expect(await controller.login(req)).toBe(result);
    });
  });

  describe('getProfile', () => {
    it('should return the user profile', () => {
      const user = {
        userId: 1,
        username: 'admin',
        roles: [Role.Admin],
        permissions: [Permission.ManageUsers],
      };
      const req = { user };

      expect(controller.getProfile(req)).toBe(user);
    });
  });
}); 