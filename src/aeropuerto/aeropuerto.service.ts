import { Injectable } from '@nestjs/common';
import { BusinessError, BusinessLogicException } from '../shared/errors/bussines-error';
import { AeropuertoEntity } from './aeropuerto.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AeropuertoService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>
    ) {}

    async findAll(): Promise<AeropuertoEntity[]> {
        return await this.aeropuertoRepository.find({  });
    }

    async findOne(id: string): Promise<AeropuertoEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id}} );
        if (!aeropuerto)
          throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND);
   
        return aeropuerto;
    }

    async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {

        const tamanioCodigo = aeropuerto.codigo.length

        if (tamanioCodigo >3)
            throw new BusinessLogicException("The codigo has more than 3 characters", BusinessError.PRECONDITION_FAILED)
        
        return await this.aeropuertoRepository.save(aeropuerto);
    }

    async update(id: string, aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        const persistedMuseum: AeropuertoEntity = await this.aeropuertoRepository.findOne({where:{id}});
        if (!persistedMuseum)
          throw new BusinessLogicException("The aeropuerto with the given id was not found",  BusinessError.NOT_FOUND);
        
        const tamanioCodigo = aeropuerto.codigo.length
        if (tamanioCodigo >3)
            throw new BusinessLogicException("The codigo has more than 3 characters", BusinessError.PRECONDITION_FAILED)
        

        return await this.aeropuertoRepository.save({...persistedMuseum, ...aeropuerto});
    }

    async delete(id: string) {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where:{id}});
        if (!aeropuerto)
          throw new BusinessLogicException("The aeropuerto with the given id was not found",  BusinessError.NOT_FOUND);
     
        await this.aeropuertoRepository.remove(aeropuerto);
    }

}
