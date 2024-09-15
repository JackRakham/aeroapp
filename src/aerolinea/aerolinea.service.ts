import { Injectable } from '@nestjs/common';
import { AerolineaEntity } from './aerolinea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/bussines-error';

@Injectable()
export class AerolineaService {

    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ) {}

    async findAll(): Promise<AerolineaEntity[]> {
        return await this.aerolineaRepository.find({  });
    }

    async findOne(id: string): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id}} );
        if (!aerolinea)
          throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND);
   
        return aerolinea;
    }

    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {

        const fechaactual = new Date()
        const formatedDate = new Date(aerolinea.fechaFundacion)


        if (formatedDate > fechaactual)
            throw new BusinessLogicException("The date should be in past time",BusinessError.BAD_REQUEST)

        return await this.aerolineaRepository.save(aerolinea);
    }

    async update(id: string, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const persistedMuseum: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        if (!persistedMuseum)
          throw new BusinessLogicException("The aerolinea with the given id was not found",  BusinessError.NOT_FOUND);
        

        const fechaactual = new Date()
        const formatedDate = new Date(aerolinea.fechaFundacion)


        if (formatedDate > fechaactual)
            throw new BusinessLogicException("The date should be in past time",BusinessError.BAD_REQUEST)

        
        return await this.aerolineaRepository.save({...persistedMuseum, ...aerolinea});
    }

    async delete(id: string) {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        if (!aerolinea)
          throw new BusinessLogicException("The aerolinea with the given id was not found",  BusinessError.NOT_FOUND);
     
        await this.aerolineaRepository.remove(aerolinea);
    }

}
