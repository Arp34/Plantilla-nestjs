import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import type { Role } from '../common/enums/role.enum.js';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepo: Repository<User>) {}

  // Single place where passwords are hashed (register, admin creation and seed use it)
  // Único lugar donde se hashean contraseñas (registro, creación por admin y seed lo usan)
  async create(data: { name: string; email: string; password: string; role: Role }) {
    if (await this.findByEmail(data.email)) {
      throw new ConflictException(`El email ${data.email} ya está registrado`);
    }
    const password = await hash(data.password, 10);
    return this.usersRepo.save(this.usersRepo.create({ ...data, password }));
  }

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  findByEmailWithPassword(email: string) {
    return this.usersRepo.findOne({
      where: { email },
      select: { id: true, name: true, email: true, role: true, password: true },
    });
  }

  findAll() {
    return this.usersRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return user;
  }
}
