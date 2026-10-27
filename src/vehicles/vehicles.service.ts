import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, type FindOptionsWhere } from 'typeorm';
import type { CreateVehicleDto } from './dto/create-vehicle.dto.js';
import type { QueryVehicleDto } from './dto/query-vehicle.dto.js';
import type { UpdateVehicleDto } from './dto/update-vehicle.dto.js';
import { Vehicle } from './entities/vehicle.entity.js';
import { VehicleStatus } from './enums/vehicle-status.enum.js';

@Injectable()
export class VehiclesService {
  constructor(@InjectRepository(Vehicle) private readonly vehiclesRepo: Repository<Vehicle>) {}

  async create(dto: CreateVehicleDto) {
    await this.assertPlateIsFree(dto.plate);
    return this.vehiclesRepo.save(this.vehiclesRepo.create(dto));
  }

  async findAll({ page, limit, status, search }: QueryVehicleDto) {
    const base: FindOptionsWhere<Vehicle> = status ? { status } : {};
    // An array in "where" means OR between conditions
    // Un arreglo en "where" significa OR entre condiciones
    const where: FindOptionsWhere<Vehicle>[] = search
      ? [
          { ...base, plate: ILike(`%${search}%`) },
          { ...base, brand: ILike(`%${search}%`) },
          { ...base, model: ILike(`%${search}%`) },
        ]
      : [base];

    const [items, total] = await this.vehiclesRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const vehicle = await this.vehiclesRepo.findOneBy({ id });
    if (!vehicle) throw new NotFoundException(`Vehículo ${id} no encontrado`);
    return vehicle;
  }

  async findByPlate(plate: string) {
    const normalized = plate.trim().toUpperCase();
    const vehicle = await this.vehiclesRepo.findOneBy({ plate: normalized });
    if (!vehicle) throw new NotFoundException(`Vehículo con placa ${normalized} no encontrado`);
    return vehicle;
  }

  async update(id: string, dto: UpdateVehicleDto) {
    const vehicle = await this.findOne(id);

    if (dto.plate && dto.plate !== vehicle.plate) await this.assertPlateIsFree(dto.plate);

    // Odometer only goes forward: lowering it would break the maintenance mileage rule
    // El odómetro solo avanza: bajarlo rompería la regla de kilometraje de mantenimientos
    if (dto.mileage !== undefined && dto.mileage < vehicle.mileage) {
      throw new BadRequestException(
        `El kilometraje no puede ser menor al actual (${vehicle.mileage} km)`,
      );
    }

    Object.assign(vehicle, dto);
    return this.vehiclesRepo.save(vehicle);
  }

  // Logical delete = INACTIVE status; the row stays so maintenance history is not lost
  // Eliminación lógica = estado INACTIVE; la fila se conserva para no perder el historial
  async deactivate(id: string) {
    const vehicle = await this.findOne(id);
    if (vehicle.status === VehicleStatus.IN_MAINTENANCE) {
      throw new ConflictException(
        `El vehículo ${vehicle.plate} está en mantenimiento y no puede inactivarse`,
      );
    }
    vehicle.status = VehicleStatus.INACTIVE;
    return this.vehiclesRepo.save(vehicle);
  }

  async activate(id: string) {
    const vehicle = await this.findOne(id);
    if (vehicle.status !== VehicleStatus.INACTIVE) {
      throw new ConflictException(`El vehículo ${vehicle.plate} ya está activo`);
    }
    vehicle.status = VehicleStatus.AVAILABLE;
    return this.vehiclesRepo.save(vehicle);
  }

  // Check in code to return a clear 409; the unique index still protects against race conditions
  // Validamos en código para un 409 claro; el índice único protege ante concurrencia
  private async assertPlateIsFree(plate: string) {
    const exists = await this.vehiclesRepo.exists({ where: { plate }, withDeleted: true });
    if (exists) throw new ConflictException(`Ya existe un vehículo con la placa ${plate}`);
  }
}
