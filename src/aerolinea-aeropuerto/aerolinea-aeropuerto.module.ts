import { Module } from '@nestjs/common';

import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AerolineaAeropuertoController } from './aerolinea-aeropuerto.controller';

@Module({
  providers: [AerolineaAeropuertoService],
  imports: [TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity])],
  controllers: [AerolineaAeropuertoController]
})
export class AerolineaAeropuertoModule {}
