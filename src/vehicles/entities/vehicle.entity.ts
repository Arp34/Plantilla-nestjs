import { Column, Entity, OneToMany, type Relation } from 'typeorm';
import { AppBaseEntity } from '../../common/entities/base.entity.js';
import type { Maintenance } from '../../maintenances/entities/maintenance.entity.js';
import { VehicleStatus } from '../enums/vehicle-status.enum.js';

@Entity('vehicles')
export class Vehicle extends AppBaseEntity {
  // Unique index at DB level: last line of defense against duplicate plates
  // Índice único en BD: última defensa contra placas duplicadas
  @Column({ unique: true, length: 10 })
  plate: string;

  @Column({ length: 60 })
  brand: string;

  @Column({ length: 60 })
  model: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int', default: 0 })
  mileage: number;

  // Postgres native enum: the DB itself rejects values outside the list
  // Enum nativo de Postgres: la BD rechaza valores fuera de la lista
  @Column({ type: 'enum', enum: VehicleStatus, default: VehicleStatus.AVAILABLE })
  status: VehicleStatus;

  // Inverse side of Maintenance.vehicle: no column here, the FK lives in "maintenances"
  // Lado inverso de Maintenance.vehicle: no crea columna aquí, la FK vive en "maintenances"
  @OneToMany('Maintenance', 'vehicle')
  maintenances: Relation<Maintenance[]>;
}
