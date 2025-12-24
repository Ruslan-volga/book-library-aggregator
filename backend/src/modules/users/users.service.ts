import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './user.entity';

export interface SearchUserParams {
  limit?: number;
  offset?: number;
  email?: string;
  name?: string;
  contactPhone?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });  // <-- исправлено
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'passwordHash', 'name', 'contactPhone', 'role', 'createdAt', 'updatedAt']
    });
  }

  async findAll(params: SearchUserParams): Promise<User[]> {
    const { limit = 10, offset = 0, email, name, contactPhone } = params;
    const where: any = {};

    if (email) {
      where.email = Like(`%${email}%`);
    }
    if (name) {
      where.name = Like(`%${name}%`);
    }
    if (contactPhone) {
      where.contactPhone = Like(`%${contactPhone}%`);
    }

    return this.usersRepository.find({
      where,
      take: limit,
      skip: offset,
    });
  }
}