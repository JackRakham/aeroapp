import { AerolineaEntity } from "../aerolinea/aerolinea.entity";
import { Column, Entity, ManyToOne,JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class AeropuertoEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    codigo: string;

    @Column()
    pais: string;


    @Column()
    ciudad: string;

    


    @ManyToMany( () => AerolineaEntity, aerolinea => aerolinea.aeropuertos)
    @JoinTable()
    aerolineas: AerolineaEntity[];











}
