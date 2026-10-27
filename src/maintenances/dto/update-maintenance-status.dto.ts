import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { MaintenanceStatus } from '../enums/maintenance-status.enum.js';

// Closing fields are optional here; the service requires them only when status = COMPLETED
// Los campos de cierre son opcionales aquí; el servicio los exige solo cuando status = COMPLETED
export class UpdateMaintenanceStatusDto {
  @ApiProperty({ enum: MaintenanceStatus, example: MaintenanceStatus.IN_PROGRESS })
  @IsEnum(MaintenanceStatus)
  status: MaintenanceStatus;

  @ApiPropertyOptional({ example: 'Se cambió aceite 15W40 y filtros de aire y aceite' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  workPerformed?: string;

  @ApiPropertyOptional({ example: 350000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  finalCost?: number;

  @ApiPropertyOptional({ example: '2026-11-03T09:00:00-05:00' })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'finishedAt debe ser una fecha ISO válida' })
  finishedAt?: Date;

  @ApiPropertyOptional({ example: 46010 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  finalMileage?: number;
}
