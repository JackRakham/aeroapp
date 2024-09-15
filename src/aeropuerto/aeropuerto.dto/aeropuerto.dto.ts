import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AeropuertoDto {

    @IsString()
    readonly nombre: string;

    @IsString()
    readonly codigo: string;

    @IsString()
    readonly pais: string;


    @IsString()
    readonly ciudad: string;


}
