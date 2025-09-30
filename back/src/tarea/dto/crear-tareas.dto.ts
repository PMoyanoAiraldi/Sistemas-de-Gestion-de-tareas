import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { estadoEnum, prioridadEnum } from "../tarea.entity";


export class CrearTareaDto { 
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    @IsOptional()
    descripcion?: string;


    @IsEnum(estadoEnum)
    @IsOptional()
    estado?: estadoEnum;

    @IsEnum(prioridadEnum)
    @IsNotEmpty()
    prioridad: prioridadEnum;


    @IsDateString()
    @IsOptional()
    fecha_limite?: string; // Como string en formato ISO


    @IsUUID()
    @IsNotEmpty()
    usuario_creador_id: string;

    @IsUUID()
    @IsOptional()
    usuario_asignado_id?: string;

    @IsUUID()
    @IsNotEmpty()
    categoria_id: string;

}