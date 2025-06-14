import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const dbUser = await this.usersService.findOne(user.username, true);
    if (!dbUser) {
        throw new Error("User not found")
    }
    const roles = dbUser.roles.map((role) => role.name);
    const permissions = dbUser.roles.flatMap((role) => role.permissions.map((p) => p.name));
    
    const payload = { 
        username: dbUser.username, 
        sub: dbUser.id,
        roles,
        permissions
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
} 