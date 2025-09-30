import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { rolEnum } from "../usuario.entity";

export class RespuestaUsuarioDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    nombre: string;

    
    @IsEmail()
    email: string;

    @IsEnum(rolEnum)
    rol: rolEnum;

}


