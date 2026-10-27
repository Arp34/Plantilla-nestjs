import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto.js';
import { VehicleStatus } from '../enums/vehicle-status.enum.js';

export class QueryVehicleDto extends PaginationDto {
  @ApiPropertyOptional({ enum: VehicleStatus })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @ApiPropertyOptional({ example: 'chevrolet', description: 'Busca por placa, marca o modelo' })
  @IsOptional()
  @IsString()
  search?: string;
}
