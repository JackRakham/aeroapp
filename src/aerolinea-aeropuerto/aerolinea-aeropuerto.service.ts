import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/bussines-error';
import { Repository } from 'typeorm';

@Injectable()
export class AerolineaAeropuertoService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>,
     
        @InjectRepository(AerolineaEntity)
        private readonly AerolineaRepository: Repository<AerolineaEntity>
    ) {}

    async addAirportToAirline(aerolineaId: string, aeropuertoId: string): Promise<AerolineaEntity> {
      const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}});
      if (!aeropuerto)
        throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND)
     
      const aerolinea: AerolineaEntity = await this.AerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]}) 
      if (!aerolinea)
        throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND)
   
      aerolinea.aeropuertos = [...aerolinea.aeropuertos, aeropuerto];
      return await this.AerolineaRepository.save(aerolinea);
    }


    async updateAirportsFromAirline(aerolineaId: string, aeropuertos: AeropuertoEntity[]): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.AerolineaRepository.findOne({where: {id: aerolineaId}});
     
        if (!aerolinea)
          throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < aeropuertos.length; i++) {
          const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertos[i].id}});
          if (!aeropuerto)
            throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        aerolinea.aeropuertos = aeropuertos;
        return await this.AerolineaRepository.save(aerolinea);
    }

    async findAirportsFromAirline(aerolineaId: string): Promise<AeropuertoEntity[]> {
      const aerolinea: AerolineaEntity = await this.AerolineaRepository.findOne({where: {id: aerolineaId },relations:["aeropuertos"]});
      if (!aerolinea)
        throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND)
      
      return aerolinea.aeropuertos;
  }


    async findAirportFromAirline(aerolineaId: string, aeropuertoId: string): Promise<AeropuertoEntity> {
      const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}});
      if (!aeropuerto)
        throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND)
      
      const aerolinea: AerolineaEntity = await this.AerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]}); 
      if (!aerolinea)
        throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND)
  
      const aerolineaaeropuerto: AeropuertoEntity = aerolinea.aeropuertos.find(e => e.id === aeropuerto.id);
  
      if (!aerolineaaeropuerto)
        throw new BusinessLogicException("The aeropuerto with the given id is not associated to the aerolinea", BusinessError.PRECONDITION_FAILED)
  
      return aerolineaaeropuerto;
  }

    
    async deleteAirportFromAirline(aerolineaId: string, aeropuertoId: string){
      const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}});
      if (!aeropuerto)
        throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND)
   
      const aerolinea: AerolineaEntity = await this.AerolineaRepository.findOne({where: {id: aerolineaId}, relations: ["aeropuertos"]});
      if (!aerolinea)
        throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND)
   
      const aerolineaaeropuerto: AeropuertoEntity = aerolinea.aeropuertos.find(e => e.id === aeropuerto.id);
   
      if (!aerolineaaeropuerto)
          throw new BusinessLogicException("The aeropuerto with the given id is not associated to the aerolinea", BusinessError.PRECONDITION_FAILED)

      aerolinea.aeropuertos = aerolinea.aeropuertos.filter(e => e.id !== aeropuertoId);
      await this.AerolineaRepository.save(aerolinea);
  } 

}