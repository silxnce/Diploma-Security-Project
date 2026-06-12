import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from '../common/enums/user-status.enum';
import { UserRole } from '../common/enums/user-role.enum';
import { hashPassword } from '../common/utils/hash.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find({
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        failedLoginAttempts: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findById(id: number) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async incrementFailedLoginAttempts(userId: number) {
    await this.usersRepository.increment(
      { id: userId },
      'failedLoginAttempts',
      1,
    );
  }

  async markSuccessfulLogin(userId: number) {
    await this.usersRepository.update(userId, {
      failedLoginAttempts: 0,
      lastLoginAt: new Date(),
    });
  }

  create(email: string, password: string) {
    const user = this.usersRepository.create({
      email,
      password,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    });

    return this.usersRepository.save(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    if (dto.email) {
      user.email = dto.email;
    }

    if (dto.password) {
      user.password = await hashPassword(dto.password);
    }

    return this.usersRepository.save(user);
  }

  async changeRole(id: number, role: UserRole) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    user.role = role;

    return this.usersRepository.save(user);
  }

  async block(id: number) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    user.status = UserStatus.BLOCKED;

    return this.usersRepository.save(user);
  }

  async activate(id: number) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    user.status = UserStatus.ACTIVE;

    return this.usersRepository.save(user);
  }
}
