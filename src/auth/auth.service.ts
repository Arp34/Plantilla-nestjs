import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { Role } from '../common/enums/role.enum.js';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface.js';
import type { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import type { LoginDto, RegisterDto } from './dto/auth.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Public registration always creates TECHNICIAN: nobody can self-register as ADMIN
  // El registro público siempre crea TECHNICIAN: nadie puede auto-registrarse como ADMIN
  async register(dto: RegisterDto) {
    const user = await this.usersService.create({ ...dto, role: Role.TECHNICIAN });
    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    // Same message for "email not found" and "wrong password" so attackers can't guess valid emails
    // Mismo mensaje para "email no existe" y "contraseña incorrecta" para no revelar emails válidos
    if (!user || !(await compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.buildAuthResponse(user);
  }

  private async buildAuthResponse(user: User) {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }
}
