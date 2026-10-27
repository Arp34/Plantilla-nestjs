import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { AuthRequest, JwtPayload } from '../interfaces/jwt-payload.interface.js';

// Param decorator: returns req.user (filled by JwtAuthGuard) or one field of it, e.g. @CurrentUser('sub')
// Decorador de parámetro: devuelve req.user (lo llena JwtAuthGuard) o un campo, ej. @CurrentUser('sub')
export const CurrentUser = createParamDecorator(
  (field: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest<AuthRequest>();
    return field ? user?.[field] : user;
  },
);