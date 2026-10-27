import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreateWorkshopDto } from './dto/create-workshop.dto.js';
import type { UpdateWorkshopDto } from './dto/update-workshop.dto.js';
import { Workshop } from './entities/workshop.entity.js';

@Injectable()
export class WorkshopsService {
  constructor(@InjectRepository(Workshop) private readonly workshopsRepo: Repository<Workshop>) {}

  async create(dto: CreateWorkshopDto) {
    await this.assertNameIsFree(dto.name);
    return this.workshopsRepo.save(this.workshopsRepo.create(dto));
  }

  findActive() {
    return this.workshopsRepo.find({ where: { isActive: true }, order: { name: 'ASC' } });
  }

  findAll() {
    return this.workshopsRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const workshop = await this.workshopsRepo.findOneBy({ id });
    if (!workshop) throw new NotFoundException(`Taller ${id} no encontrado`);
    return workshop;
  }

  async update(id: string, dto: UpdateWorkshopDto) {
    const workshop = await this.findOne(id);
    if (dto.name && dto.name !== workshop.name) await this.assertNameIsFree(dto.name);
    Object.assign(workshop, dto);
    return this.workshopsRepo.save(workshop);
  }

  async setActive(id: string, isActive: boolean) {
    const workshop = await this.findOne(id);
    if (workshop.isActive === isActive) {
      throw new ConflictException(`El taller ya está ${isActive ? 'activo' : 'inactivo'}`);
    }
    workshop.isActive = isActive;
    return this.workshopsRepo.save(workshop);
  }

  private async assertNameIsFree(name: string) {
    const exists = await this.workshopsRepo.exists({ where: { name } });
    if (exists) throw new ConflictException(`Ya existe un taller llamado ${name}`);
  }
}
