import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { estadoEnum, prioridadEnum } from "../tarea.entity";


export class ModificarTareaDto { 
    @IsString()
    @IsOptional()
    titulo: string;

    @IsString()
    @IsOptional()
    descripcion?: string;


    @IsEnum(estadoEnum)
    @IsOptional()
    estado?: estadoEnum;

    @IsEnum(prioridadEnum)
    @IsOptional()
    prioridad: prioridadEnum;


    @IsDateString()
    @IsOptional()
    fecha_limite?: Date;


    @IsUUID()
    @IsOptional()
    usuario_creador_id: string;

    @IsUUID()
    @IsOptional()
    usuario_asignado_id?: string;

    @IsUUID()
    @IsOptional()
    categoria_id: string;

}