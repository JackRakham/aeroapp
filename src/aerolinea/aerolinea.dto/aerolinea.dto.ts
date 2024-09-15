import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AerolineaDto {

    
    @IsString()
    nombre: string;

    @IsString()
    descripcion: string;

    @IsString()
    readonly web: string;


    @IsString()
    readonly fechaFundacion: string;
}
