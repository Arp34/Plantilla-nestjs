import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

export class CreateVehicleDto {
  // Normalize before validating so "abc123" and "ABC123 " are the same plate
  // Normalizar antes de validar para que "abc123" y "ABC123 " sean la misma placa
  @ApiProperty({ example: 'ABC123' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsString()
  @Matches(/^[A-Z0-9-]{5,10}$/, { message: 'La placa debe tener entre 5 y 10 caracteres alfanuméricos' })
  plate: string;

  @ApiProperty({ example: 'Chevrolet' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  brand: string;

  @ApiProperty({ example: 'NPR' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  model: string;

  @ApiProperty({ example: 2022 })
  @Type(() => Number)
  @IsInt()
  @Min(1980)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @ApiProperty({ example: 45000 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  mileage: number;
}
