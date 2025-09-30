import {  IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CrearUsuarioDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    nombre: string;

    
    @IsEmail()
    email: string;


    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[=!@#$%^&*])[A-Za-z\d=!@#$%^&*]{8,15}$/,
        {
            message: "La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)"
        }
    )
    @IsNotEmpty()
    @IsString()
    contrasenia: string;

    
}


