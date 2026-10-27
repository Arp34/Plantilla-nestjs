import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity.js';
import { VehiclesController } from './vehicles.controller.js';
import { VehiclesService } from './vehicles.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  // Exported so MaintenancesModule can read/update vehicle status later
  // Se exporta para que MaintenancesModule pueda consultar/cambiar el estado del vehículo
  exports: [VehiclesService, TypeOrmModule],
})
export class VehiclesModule {}
