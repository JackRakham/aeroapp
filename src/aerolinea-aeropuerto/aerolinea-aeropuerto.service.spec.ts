import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { Repository } from 'typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { TypeOrmTestingConfig } from '../shared/testin-utils/typeorm-testing-config.ts';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker/.';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertosList : AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    aeropuertoRepository.clear();
    aerolineaRepository.clear();

    aeropuertosList = [];
    for(let i = 0; i < 5; i++){
      const aeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
        nombre: faker.company.name(),
        codigo: faker.lorem.word( {length: {min:1,max: 3}}),
        pais: faker.location.country(),
        ciudad: faker.location.city(),
        aerolineas: []
        })
        aeropuertosList.push(aeropuerto);
    }

    aerolinea = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(),
      web: faker.image.url(),
      fechaFundacion: String(faker.date.anytime),
      aeropuertos: aeropuertosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addaeropuertoaerolinea should add a aeropuerto to a aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.lorem.word( {length: {min:1,max: 3}}),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });

    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(),
      web: faker.image.url(),
      fechaFundacion: String(faker.date.anytime),
    })

    const result: AerolineaEntity = await service.addAirportToAirline(newAerolinea.id, newAeropuerto.id);
    

    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].nombre).toBe(newAeropuerto.nombre)
  });

  it('addaeropuertoaerolinea should thrown exception for an invalid aeropuerto', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(),
      web: faker.image.url(),
      fechaFundacion: String(faker.date.anytime),
    })

    await expect(() => service.addAirportToAirline(newAerolinea.id, "0")).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found");
  });

  it('addaeropuertoaerolinea should throw an exception for an invalid aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.lorem.word(),
      codigo: faker.lorem.word( {length: {min:1,max: 3}}),
        pais: faker.location.country(),
        ciudad: faker.location.city(),
    });

    await expect(() => service.addAirportToAirline("0", newAeropuerto.id)).rejects.toHaveProperty("message", "The aerolinea with the given id was not found");
  });

  it('findAirportFromAirline should return aeropuerto by aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    const storedaeropuerto: AeropuertoEntity = await service.findAirportFromAirline(aerolinea.id, aeropuerto.id, )
    expect(storedaeropuerto).not.toBeNull();
    expect(storedaeropuerto.nombre).toBe(aeropuerto.nombre);
  });

  it('findAirportFromAirline should throw an exception for an invalid aeropuerto', async () => {
    await expect(()=> service.findAirportFromAirline(aerolinea.id, "0")).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found"); 
  });

  it('findAirportFromAirline should throw an exception for an invalid aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0]; 
    await expect(()=> service.findAirportFromAirline("0", aeropuerto.id)).rejects.toHaveProperty("message", "The aerolinea with the given id was not found"); 
  });

  it('findAirportFromAirline should throw an exception for a aeropuerto not associated to the aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
        codigo: faker.lorem.word( {length: {min:1,max: 3}}),
        pais: faker.location.country(),
        ciudad: faker.location.city(),
    });

    await expect(()=> service.findAirportFromAirline(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", "The aeropuerto with the given id is not associated to the aerolinea"); 
  });

  it('findAirportsFromAirline should return aeropuertos by aerolinea', async ()=>{
    const aeropuertos: AeropuertoEntity[] = await service.findAirportsFromAirline(aerolinea.id);
    expect(aeropuertos.length).toBe(5)
  });

  it('findAirportsFromAirline should throw an exception for an invalid aerolinea', async () => {
    await expect(()=> service.findAirportsFromAirline("0")).rejects.toHaveProperty("message", "The aerolinea with the given id was not found"); 
  });

  it('updateAirportsFromAirline should update aeropuertos list for a aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.lorem.word( {length: {min:1,max: 3}}),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });
    
    const updatedaerolinea: AerolineaEntity = await service.updateAirportsFromAirline(aerolinea.id, [newAeropuerto]);
    expect(updatedaerolinea.aeropuertos.length).toBe(1);
    expect(updatedaerolinea.aeropuertos[0].nombre).toBe(newAeropuerto.nombre);
  });

  it('updateAirportsFromAirline should throw an exception for an invalid aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.lorem.word( {length: {min:1,max: 3}}),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });
    

    await expect(()=> service.updateAirportsFromAirline("0", [newAeropuerto])).rejects.toHaveProperty("message", "The aerolinea with the given id was not found"); 
  });

  it('updateAirportsFromAirline should throw an exception for an invalid aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = aeropuertosList[0];
    newAeropuerto.id = "0";

    await expect(()=> service.updateAirportsFromAirline(aerolinea.id, [newAeropuerto])).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found"); 
  });

  it('deleteaeropuertoToaerolinea should remove a aeropuerto from a aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    
    await service.deleteAirportFromAirline(aerolinea.id, aeropuerto.id);

    const storedaerolinea: AerolineaEntity = await aerolineaRepository.findOne({where: {id: aerolinea.id}, relations: ["aeropuertos"]});
    const deletedaeropuerto: AeropuertoEntity = storedaerolinea.aeropuertos.find(a => a.id === aeropuerto.id);

    expect(deletedaeropuerto).toBeUndefined();

  });

  it('deleteaeropuertoToaerolinea should thrown an exception for an invalid aeropuerto', async () => {
    await expect(()=> service.deleteAirportFromAirline(aerolinea.id, "0")).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found"); 
  });

  it('deleteaeropuertoToaerolinea should thrown an exception for an invalid aerolinea', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(()=> service.deleteAirportFromAirline("0", aeropuerto.id)).rejects.toHaveProperty("message", "The aerolinea with the given id was not found"); 
  });

  it('deleteaeropuertoToaerolinea should thrown an exception for an non asocciated aeropuerto', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.lorem.word( {length: {min:1,max: 3}}),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    });

    await expect(()=> service.deleteAirportFromAirline(aerolinea.id, newAeropuerto.id)).rejects.toHaveProperty("message", "The aeropuerto with the given id is not associated to the aerolinea"); 
  }); 

});

