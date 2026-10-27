import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../common/decorators/auth.decorator.js';
import { Role } from '../common/enums/role.enum.js';
import { CreateVehicleDto } from './dto/create-vehicle.dto.js';
import { QueryVehicleDto } from './dto/query-vehicle.dto.js';
import { UpdateVehicleDto } from './dto/update-vehicle.dto.js';
import { VehiclesService } from './vehicles.service.js';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Auth(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(dto);
  }

  // @Auth() without roles: any authenticated user can read
  // @Auth() sin roles: cualquier usuario autenticado puede consultar
  @Auth()
  @Get()
  findAll(@Query() query: QueryVehicleDto) {
    return this.vehiclesService.findAll(query);
  }

  @Auth()
  @Get('plate/:plate')
  findByPlate(@Param('plate') plate: string) {
    return this.vehiclesService.findByPlate(plate);
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Auth(Role.ADMIN)
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, dto);
  }

  @Auth(Role.ADMIN)
  @Patch(':id/activate')
  activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiclesService.activate(id);
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiclesService.deactivate(id);
  }
}
