import { Tarea } from 'src/tarea/tarea.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Categoria {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    
    @Column({ length: 50, nullable: false })
    nombre: string;

    @OneToMany(() => Tarea, (tarea) => tarea.categoria)
    tarea: Tarea[];

    @Column({ default: true }) 
    estado: boolean
}



