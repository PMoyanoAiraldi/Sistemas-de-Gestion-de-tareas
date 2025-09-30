import {  Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tarea } from "./tarea.entity";
import { Repository } from "typeorm";
import { Usuario } from "src/usuario/usuario.entity";
import { Categoria } from "src/categoria/categoria.entity";
import { CrearTareaDto } from "./dto/crear-tareas.dto";
import { ModificarTareaDto } from "./dto/modificar-tarea.dto";
import { RespuestaTareaDto } from "./dto/respuesta-tarea.dto";

@Injectable()
export class TareasService {
    constructor(
        @InjectRepository(Tarea)
        private tareasRepository: Repository<Tarea>,
        @InjectRepository(Usuario)
        private usuariosRepository: Repository<Usuario>,
        @InjectRepository(Categoria)
        private categoriasRepository: Repository<Categoria>,
    ) {}

    async crearTarea(crearTareaDto: CrearTareaDto): Promise<Tarea> {
        // Buscamos las relaciones
        const usuarioCreador = await this.usuariosRepository.findOne({
            where: { id: crearTareaDto.usuario_creador_id }
        });

        if (!usuarioCreador) {
            throw new NotFoundException('Usuario creador no encontrado');
        }

        const usuarioAsignado = await this.usuariosRepository.findOne({
                where: { id: crearTareaDto.usuario_asignado_id }
        });

        if (!usuarioAsignado) {
            throw new NotFoundException('Usuario asignado no encontrado');
        }
    

        const categoria = await this.categoriasRepository.findOne({
            where: { id: crearTareaDto.categoria_id }
        });

        if (!categoria) {
            throw new NotFoundException('Categoría no encontrada');
        }

        // Crear la tarea
        const tarea = this.tareasRepository.create({
            titulo: crearTareaDto.titulo,
            descripcion: crearTareaDto.descripcion,
            estado: crearTareaDto.estado,
            prioridad: crearTareaDto.prioridad,
            fecha_limite: crearTareaDto.fecha_limite,
            usuario_creador: usuarioCreador,
            usuario_asignado: usuarioAsignado,
            categoria: categoria,
        });

        return await this.tareasRepository.save(tarea);
    
    }

    async obtenerTareas(): Promise<Tarea[]> {
        return await this.tareasRepository.find();
    }


    async obtenerTareaPorId(id: string): Promise<Tarea> {
        const tarea = await this.tareasRepository.findOne({ where: { id } });
        if (!tarea) {
            throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
        }
        return tarea;
    }


    async modificarTarea(id: string, modificartTareaDto: ModificarTareaDto): Promise<RespuestaTareaDto> {
        
        const tareaExistente = await this.tareasRepository.findOne({ where: { id }, 
            relations: ['usuario_creador',' usuario_asignado', 'categoria'] });
        if (!tareaExistente) {
            throw new NotFoundException('Tarea no encontrada');
        }
    
        // Actualizar los campos de la clase con los nuevos datos
        if (modificartTareaDto.titulo) tareaExistente.titulo = modificartTareaDto.titulo;
        if (modificartTareaDto.descripcion) tareaExistente.descripcion = modificartTareaDto.descripcion;
        if (modificartTareaDto.estado) tareaExistente.estado = modificartTareaDto.estado;
        if (modificartTareaDto.prioridad) tareaExistente.prioridad = modificartTareaDto.prioridad;
        if (modificartTareaDto.fecha_limite) tareaExistente.fecha_limite = modificartTareaDto.fecha_limite;
    
        if (modificartTareaDto.usuario_creador_id) {
        const usuarioCreador = await this.usuariosRepository.findOne({ 
            where: { id: modificartTareaDto.usuario_creador_id } 
        });
        if (!usuarioCreador) {
            throw new NotFoundException('Usuario creador no encontrado');
        }
        tareaExistente.usuario_creador = usuarioCreador;
    }
        
        if (modificartTareaDto.usuario_asignado_id) {
            const usuarioAsignado = await this.usuariosRepository.findOne({ where: { id: modificartTareaDto.usuario_asignado_id } });
            if (!usuarioAsignado) {
                throw new NotFoundException('Usuario asignado no encontrado');
            }
            tareaExistente.usuario_asignado = usuarioAsignado; 
        }      
        
        if (modificartTareaDto.categoria_id) {
        const categoria = await this.categoriasRepository.findOne({ 
            where: { id: modificartTareaDto.categoria_id } 
        });
        if (!categoria) {
            throw new NotFoundException('Categoría no encontrada');
        }
        tareaExistente.categoria = categoria;
    }
    
        // Guardar los cambios en la base de datos
        await this.tareasRepository.save(tareaExistente);
    
        // Devolver el DTO con la tarea actualizada
        return new RespuestaTareaDto(tareaExistente); // Se asegura que se devuelve un DTO
    }
        

async eliminarTarea(id: string): Promise<string> {
        const tarea = await this.tareasRepository.findOne({ where: { id } });
        if (!tarea) {
            throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
        }
        const tituloTarea = tarea.titulo;
        await this.tareasRepository.remove(tarea);
        return `Tarea "${tituloTarea}" eliminada exitosamente`;
    }
}

