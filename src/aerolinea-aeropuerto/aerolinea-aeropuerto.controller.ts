
import { plainToInstance } from 'class-transformer';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { AeropuertoDto } from 'src/aeropuerto/aeropuerto.dto/aeropuerto.dto';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';

@Controller('aerolineas')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaAeropuertoController {

    constructor(private readonly aerolineaAeropuertoService: AerolineaAeropuertoService){}


    
    
    @Post(':aerolineaId/aeropuertos/:aeropuertoId')
    async addAirportToAirline(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
        return await this.aerolineaAeropuertoService.addAirportToAirline(aerolineaId, aeropuertoId);
    }

    @Get(':aerolineaId/aeropuertos/:aeropuertoId')
    async findAirportFromAirline(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
        return await this.aerolineaAeropuertoService.findAirportFromAirline(aerolineaId,aeropuertoId);
    }

    
    
    @Get(':aerolineaId/aeropuertos')
    async findAirportsFromAirline(@Param('aerolineaId') aerolineaId: string){
        return await this.aerolineaAeropuertoService.findAirportsFromAirline(aerolineaId);
    }

    @Put(':aerolineaId/aeropuertos')
    async updateAirportsFromAirline (@Body () aeropuertosDto: AeropuertoDto[], @Param('aerolineaId') aerolineaId: string){
        const aeropuertos = plainToInstance(AeropuertoEntity, aeropuertosDto)
        return await this.aerolineaAeropuertoService.updateAirportsFromAirline(aerolineaId,aeropuertos);
    }


    
    
    @Delete(':aerolineaId/aeropuertos/:aeropuertoId')
    @HttpCode(204)
    async deleteAirportFromAirline(@Param('aerolineaId') aerolineaId: string, @Param('aeropuertoId') aeropuertoId: string){
        return await this.aerolineaAeropuertoService.deleteAirportFromAirline(aerolineaId, aeropuertoId);        
    }

}
