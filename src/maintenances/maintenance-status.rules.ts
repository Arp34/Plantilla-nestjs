import { BadRequestException, ConflictException } from '@nestjs/common';
import type { UpdateMaintenanceStatusDto } from './dto/update-maintenance-status.dto.js';
import { MaintenanceStatus } from './enums/maintenance-status.enum.js';

// "Active" = still occupies the vehicle and the mechanic's schedule
// "Activo" = todavía ocupa el vehículo y la agenda del mecánico
export const ACTIVE_STATUSES = [MaintenanceStatus.SCHEDULED, MaintenanceStatus.IN_PROGRESS];

// State machine: each status lists where it can go. COMPLETED and CANCELLED are final (empty list)
// Máquina de estados: cada estado lista a dónde puede ir. COMPLETED y CANCELLED son finales (lista vacía)
export const ALLOWED_TRANSITIONS: Record<MaintenanceStatus, MaintenanceStatus[]> = {
  [MaintenanceStatus.SCHEDULED]: [MaintenanceStatus.IN_PROGRESS, MaintenanceStatus.CANCELLED],
  [MaintenanceStatus.IN_PROGRESS]: [MaintenanceStatus.COMPLETED, MaintenanceStatus.CANCELLED],
  [MaintenanceStatus.COMPLETED]: [],
  [MaintenanceStatus.CANCELLED]: [],
};

export function assertValidTransition(from: MaintenanceStatus, to: MaintenanceStatus) {
  if (!ALLOWED_TRANSITIONS[from].includes(to)) {
    const allowed = ALLOWED_TRANSITIONS[from];
    const hint = allowed.length ? `Desde ${from} solo se permite: ${allowed.join(', ')}` : `${from} es un estado final`;
    throw new ConflictException(`No se puede cambiar un mantenimiento de ${from} a ${to}. ${hint}`);
  }
}

export function assertClosingData(dto: UpdateMaintenanceStatusDto) {
  const required = ['workPerformed', 'finalCost', 'finishedAt', 'finalMileage'] as const;
  const missing = required.filter((field) => dto[field] === undefined || dto[field] === null);
  if (missing.length) {
    throw new BadRequestException(`Para completar el mantenimiento faltan: ${missing.join(', ')}`);
  }
}
