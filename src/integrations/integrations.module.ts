import { Module } from '@nestjs/common';
import { MaintenancesModule } from '../maintenances/maintenances.module.js';
import { IntegrationsController } from './integrations.controller.js';

@Module({
  imports: [MaintenancesModule],
  controllers: [IntegrationsController],
})
export class IntegrationsModule {}
