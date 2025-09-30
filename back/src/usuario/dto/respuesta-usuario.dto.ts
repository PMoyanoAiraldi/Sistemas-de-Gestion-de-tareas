import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RespuestaUsuarioDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    nombre: string;

    
    @IsEmail()
    email: string;

}


