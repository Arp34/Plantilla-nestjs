import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';
import { ApiKeyGuard } from '../common/guards/api-key.guard.js';
import { MaintenancesService } from '../maintenances/maintenances.service.js';

@ApiTags('integrations')
@ApiSecurity('api-key')
@ApiHeader({ name: 'x-api-key', required: true, description: 'Llave entregada al aliado externo' })
@ApiUnauthorizedResponse({ description: 'API Key ausente o inválida' })
// @Public() skips the global JWT guard; @UseGuards(ApiKeyGuard) replaces it with the API Key check
// @Public() salta el guard global de JWT; @UseGuards(ApiKeyGuard) lo reemplaza por la validación de API Key
@Public()
@UseGuards(ApiKeyGuard)
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly maintenancesService: MaintenancesService) {}

  @Get('vehicles/:plate/history')
  getVehicleHistory(@Param('plate') plate: string) {
    return this.maintenancesService.getHistoryByPlate(plate);
  }
}
