import { Module } from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from './aeropuerto.entity';
import { AeropuertoController } from './aeropuerto.controller';

@Module({
  providers: [AeropuertoService],
  imports: [TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity])],
  controllers: [AeropuertoController],
})
export class AeropuertoModule {}
