import { AeropuertoEntity } from "../aeropuerto/aeropuerto.entity";
import { Column, Entity, ManyToOne,JoinTable, ManyToMany, PrimaryGeneratedColumn, Timestamp } from "typeorm";


@Entity()
export class AerolineaEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column()
    web: string;


    @Column({ type: 'date' })
    fechaFundacion: string;

    @ManyToMany( () => AeropuertoEntity, aeropuertos => aeropuertos.aerolineas)
    @JoinTable()
    aeropuertos: AeropuertoEntity[];

}
