import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../common/decorators/auth.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Role } from '../common/enums/role.enum.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UsersService } from './users.service.js';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Only an ADMIN can create users with any role (including other admins)
  // Solo un ADMIN puede crear usuarios con cualquier rol (incluidos otros admins)
  @Auth(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Auth()
  @Get('me')
  me(@CurrentUser('sub') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Auth(Role.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Auth(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }
}
