import { SetMetadata } from '@nestjs/common';
import type { Role } from '../enums/role.enum.js';

export const ROLES_KEY = 'roles';
// Saves the allowed roles as metadata on the route; RolesGuard reads them later
// Guarda los roles permitidos como metadata de la ruta; RolesGuard los lee después
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);