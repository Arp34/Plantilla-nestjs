import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../common/enums/role.enum.js';
import { UsersService } from '../users/users.service.js';
import type { CreateMechanicDto } from './dto/create-mechanic.dto.js';
import type { QueryMechanicDto } from './dto/query-mechanic.dto.js';
import type { UpdateMechanicDto } from './dto/update-mechanic.dto.js';
import { Mechanic } from './entities/mechanic.entity.js';

@Injectable()
export class MechanicsService {
  constructor(
    @InjectRepository(Mechanic) private readonly mechanicsRepo: Repository<Mechanic>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateMechanicDto) {
    await this.assertEmailIsFree(dto.email);
    if (dto.userId) await this.assertUserCanBeLinked(dto.userId);
    return this.mechanicsRepo.save(this.mechanicsRepo.create(dto));
  }

  findAll({ isActive }: QueryMechanicDto) {
    return this.mechanicsRepo.find({
      where: isActive === undefined ? {} : { isActive },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const mechanic = await this.mechanicsRepo.findOne({ where: { id }, relations: { user: true } });
    if (!mechanic) throw new NotFoundException(`Mecánico ${id} no encontrado`);
    return mechanic;
  }

  // Used to know which mechanic is the logged-in technician
  // Se usa para saber qué mecánico es el técnico que inició sesión
  async findByUserId(userId: string) {
    const mechanic = await this.mechanicsRepo.findOneBy({ userId });
    if (!mechanic) throw new NotFoundException('Tu usuario no está vinculado a ningún mecánico');
    return mechanic;
  }

  async update(id: string, dto: UpdateMechanicDto) {
    const mechanic = await this.findOne(id);
    if (dto.email && dto.email !== mechanic.email) await this.assertEmailIsFree(dto.email);
    if (dto.userId && dto.userId !== mechanic.userId) await this.assertUserCanBeLinked(dto.userId);
    await this.mechanicsRepo.update(id, dto);
    return this.findOne(id);
  }

  // Inactivating keeps the row, so past maintenances still show who did them
  // Inactivar conserva la fila, así los mantenimientos pasados siguen mostrando quién los hizo
  async setActive(id: string, isActive: boolean) {
    const mechanic = await this.findOne(id);
    if (mechanic.isActive === isActive) {
      throw new ConflictException(`El mecánico ya está ${isActive ? 'activo' : 'inactivo'}`);
    }
    mechanic.isActive = isActive;
    return this.mechanicsRepo.save(mechanic);
  }

  private async assertEmailIsFree(email: string) {
    const exists = await this.mechanicsRepo.exists({ where: { email } });
    if (exists) throw new ConflictException(`Ya existe un mecánico con el email ${email}`);
  }

  private async assertUserCanBeLinked(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (user.role !== Role.TECHNICIAN) {
      throw new BadRequestException('Solo se puede vincular un usuario con rol TECHNICIAN');
    }
    const taken = await this.mechanicsRepo.exists({ where: { userId } });
    if (taken) throw new ConflictException('Ese usuario ya está vinculado a otro mecánico');
  }
}
