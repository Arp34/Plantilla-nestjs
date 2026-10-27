import {
  Injectable, UnauthorizedException, type CanActivate, type ExecutionContext,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import type { Env } from '../../config/env.schema.js';

// For external integrations (no user/JWT): the partner sends a key in the "x-api-key" header
// Para integraciones externas (sin usuario ni JWT): el aliado envía una llave en el header "x-api-key"
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService<Env, true>) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) throw new UnauthorizedException('API Key requerida en el header x-api-key');

    // Valid keys come from the API_KEYS env variable, never hard-coded in the source
    // Las llaves válidas vienen de la variable API_KEYS, nunca escritas en el código
    const validKeys = this.config.get('API_KEYS', { infer: true });
    if (typeof apiKey !== 'string' || !validKeys.includes(apiKey)) {
      throw new UnauthorizedException('API Key inválida');
    }
    return true;
  }
}
