import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RespuestaCategoriaDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    @IsOptional()
    nombre?: string;

    @IsBoolean()
    @IsOptional()
    estado:boolean
    
}