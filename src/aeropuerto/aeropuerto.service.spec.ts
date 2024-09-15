import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoEntity } from './aeropuerto.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testin-utils/typeorm-testing-config.ts';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker/.';
import {  AeropuertoService } from './aeropuerto.service';


describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertosList = [];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    aeropuertosList = [];
    for(let i = 0; i < 5; i++){
        const aeropuerto: AeropuertoEntity = await repository.save({
        nombre: faker.company.name(),
        codigo: faker.lorem.word( {length: {min:1,max: 3}}),
        pais: faker.location.country(),
        ciudad: faker.location.city(),
        aerolineas: []
        })
        aeropuertosList.push(aeropuerto);
        
    }
  }

  it('findAll should return all aeropuertos', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(aeropuertosList.length);
  });


  it('findOne should return an aeropuerto by id', async () => {
    const storedAeropuerto: AeropuertoEntity = aeropuertosList[0];
    const aeropuerto: AeropuertoEntity = await service.findOne(storedAeropuerto.id);
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.nombre).toEqual(storedAeropuerto.nombre)
    
  });


  it('findOne should throw an exception for an invalid aeropuerto', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found")
  });

  it('create should return a new aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: "",
      nombre: faker.company.name(),
      codigo: faker.lorem.word( {length: {min:1,max: 3}}),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: [],


        
    }
 
    const newAerolinea: AeropuertoEntity = await service.create(aeropuerto);
    expect(newAerolinea).not.toBeNull();
 
    const storedAeropuerto: AeropuertoEntity = await repository.findOne({where: {id: newAerolinea.id}})
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(newAerolinea.nombre)
    
  });

  it('update should modify an aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    aeropuerto.nombre = "New name";
    
     const updatedaerolinea: AeropuertoEntity = await service.update(aeropuerto.id, aeropuerto);
    expect(updatedaerolinea).not.toBeNull();
     const storedAeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(aeropuerto.nombre)
  });

  it('update should throw an exception for an invalid aeropuerto', async () => {
    let aeropuerto: AeropuertoEntity = aeropuertosList[0];
    aeropuerto = {
      ...aeropuerto, nombre: "New name", ciudad: "New ciudad"
    }
    await expect(() => service.update("0", aeropuerto)).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found")
  });

  it('delete should remove an aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await service.delete(aeropuerto.id);
     const deletedaerolinea: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    expect(deletedaerolinea).toBeNull();
  });

  it('delete should throw an exception for an invalid aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found")
  });


});


