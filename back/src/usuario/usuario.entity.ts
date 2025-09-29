import { Tarea } from "src/tarea/tarea.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50, nullable: false })
    nombre: string;

    @Column({ length: 50, unique: true, nullable: false })
    email: string;

    @Column({ nullable: false})
    contrasenia: string;

    @Column({default: false})
    esAdmin: boolean;

    @OneToMany(()=> Tarea, (tarea) => tarea.usuario_creador,)
    tarea_creada:Tarea[];

    @OneToMany(()=> Tarea, (tarea) => tarea.usuario_asignado,)
    tarea_asignada:Tarea[];


}