import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RegisterDto } from '../../auth/dto/auth.dto.js';
import { Role } from '../../common/enums/role.enum.js';

export class CreateUserDto extends RegisterDto {
  @ApiProperty({ enum: Role, example: Role.TECHNICIAN })
  @IsEnum(Role)
  role: Role;
}
