import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
// Only attaches metadata; JwtAuthGuard reads it with Reflector and skips the token check
// Solo agrega metadata; JwtAuthGuard la lee con Reflector y omite la validación del token
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);