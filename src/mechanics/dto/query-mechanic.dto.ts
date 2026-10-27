import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class QueryMechanicDto {
  // Read the raw text (obj[key]): implicit conversion would turn "false" into true (Boolean("false") === true)
  // Se lee el texto original (obj[key]): la conversión implícita convertiría "false" en true (Boolean("false") === true)
  @ApiPropertyOptional({ description: 'Filtrar por estado' })
  @IsOptional()
  @Transform(({ obj, key }: { obj: Record<string, unknown>; key: string }) => {
    const raw = obj[key];
    return raw === 'true' ? true : raw === 'false' ? false : raw;
  })
  @IsBoolean()
  isActive?: boolean;
}
