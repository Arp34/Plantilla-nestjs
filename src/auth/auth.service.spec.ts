import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Role } from '../common/enums/role.enum.js';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  let service: AuthService;

  const usersService = {
    findByEmail: vi.fn(),
    findByEmailWithPassword: vi.fn(),
    create: vi.fn(),
  };
  const jwtService = { signAsync: vi.fn().mockResolvedValue('token-falso') };
  const dto = { name: 'Ana', email: 'ana@mail.com', password: 'Clave1234' };

  beforeEach(async () => {
    vi.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();
    service = moduleRef.get(AuthService);
  });

  describe('register', () => {
    it('siempre registra con rol TECHNICIAN', async () => {
      usersService.create.mockResolvedValue({ id: 'u1', ...dto, role: Role.TECHNICIAN });
      const res = await service.register(dto);
      expect(usersService.create).toHaveBeenCalledWith({ ...dto, role: Role.TECHNICIAN });
      expect(res.user.role).toBe(Role.TECHNICIAN);
    });

    it('propaga ConflictException si el email ya existe', async () => {
      usersService.create.mockRejectedValue(new ConflictException());
      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('lanza UnauthorizedException si la contraseña no coincide', async () => {
      usersService.findByEmailWithPassword.mockResolvedValue({ 
        id: 'u1', password: await hash('Otra1234', 4) 
      });
      await expect(service.login({ email: dto.email, password: dto.password }))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});