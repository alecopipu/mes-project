import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(username: string, withRelations = false): Promise<User | undefined> {
    const options = withRelations 
      ? { where: { username }, relations: ['roles', 'roles.permissions'] }
      : { where: { username } };
      
    const user = await this.usersRepository.findOne(options);
    return user || undefined;
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async remove(id: number): Promise<void> {
    // Implementation of remove method
  }
} 