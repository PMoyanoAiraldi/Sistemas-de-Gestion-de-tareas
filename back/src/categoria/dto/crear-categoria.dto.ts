import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CrearCategoriaDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    nombre: string;
    
}