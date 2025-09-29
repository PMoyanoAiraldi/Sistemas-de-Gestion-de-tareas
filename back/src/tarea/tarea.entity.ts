import { IsOptional } from "class-validator";
import { Categoria } from "src/categoria/categoria.entity";
import { Usuario } from "src/usuario/usuario.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum estadoEnum {
    PENDIENTE = 'pendiente',
    EN_PROGRESO = 'en_progreso',
    COMPLETADA = 'completada',
}

export enum prioridadEnum {
    BAJA = 'baja',
    MEDIA = 'media',
    ALTA = 'alta',
}


@Entity()
export class Tarea {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100, nullable: false })
    titulo: string;

    @IsOptional()
    @Column({length: 500, nullable: true})
    descripcion?: string;


    @Column({
        type: 'enum',
        enum: estadoEnum,
        default: estadoEnum.PENDIENTE,
    })
    estado: estadoEnum


    @Column({
        type: 'enum',
        enum: prioridadEnum,
        default: prioridadEnum.ALTA,
    })
    prioridad: prioridadEnum

    @CreateDateColumn()
    fecha_de_creacion: Date;

    @Column({ type: 'date' })
    fecha_limite: Date;


    @ManyToOne(() => Usuario, (usuario) => usuario.tarea_creada)
    @JoinColumn({ name: 'usuario_crador_id' })
    usuario_creador: Usuario;

    @ManyToOne(() => Usuario, (usuario) => usuario.tarea_asignada)
    @JoinColumn({ name: 'usuario_asignado_id' })
    usuario_asignado: Usuario

    @ManyToOne(() => Categoria, (categoria) => categoria.tarea,)
    @JoinColumn({ name: "categoriaId" })
    categoria: Categoria;
    

}