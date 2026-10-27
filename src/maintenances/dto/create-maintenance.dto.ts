import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { MaintenanceType } from '../enums/maintenance-type.enum.js';

export class CreateMaintenanceDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  vehicleId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  mechanicId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  workshopId: string;

  @ApiProperty({ enum: MaintenanceType, example: MaintenanceType.PREVENTIVE })
  @IsEnum(MaintenanceType)
  type: MaintenanceType;

  @ApiProperty({ example: 'Cambio de aceite y filtros' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty({ example: 46000, description: 'Kilometraje del vehículo al ingresar' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  mileage: number;

  // ISO 8601 string ("2026-11-03T07:30:00-05:00") converted to Date before validating
  // Texto ISO 8601 ("2026-11-03T07:30:00-05:00") convertido a Date antes de validar
  @ApiProperty({ example: '2026-11-03T07:30:00-05:00' })
  @Type(() => Date)
  @IsDate({ message: 'scheduledAt debe ser una fecha ISO válida' })
  scheduledAt: Date;

  @ApiProperty({ example: 90, description: 'Duración estimada en minutos (define la hora de fin)' })
  @Type(() => Number)
  @IsInt()
  @Min(15)
  @Max(720)
  durationMinutes: number;
}
