import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateMechanicDto {
  @ApiProperty({ example: 'Carlos Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'carlos.perez@fleetcore.com' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @ApiProperty({ example: 'Motor y transmisión' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  specialty: string;

  @ApiPropertyOptional({ description: 'Usuario TECHNICIAN con el que el mecánico inicia sesión' })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
