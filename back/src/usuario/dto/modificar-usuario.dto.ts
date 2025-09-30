import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class ModificarUsuarioDto{
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    @IsOptional()
    nombre?: string;

    
    @IsEmail()
    @IsOptional()
    email: string;


    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[=!@#$%^&*])[A-Za-z\d=!@#$%^&*]{8,15}$/,
        {
            message: "La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)"
        }
    )
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    contrasenia?: string;

    @IsBoolean()
    @IsOptional()
    esAdmin?: boolean

    @IsBoolean()
    @IsOptional()
    estado?: boolean
}