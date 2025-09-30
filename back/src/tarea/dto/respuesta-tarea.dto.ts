import { estadoEnum, prioridadEnum, Tarea } from "../tarea.entity";

export class RespuestaTareaDto {
    id: string;
    titulo: string;
    descripcion?: string;
    estado: estadoEnum;
    prioridad: prioridadEnum;
    fecha_de_creacion: Date;
    fecha_limite: Date;

    usuario_creador?: {
        id: string;
        nombre: string;
        email: string;
    };

    usuario_asignado?: {
        id: string;
        nombre: string;
        email: string;
    };

    categoria?: {
        id: string;
        nombre: string;
    };

    constructor(tarea: Tarea) {
    this.id = tarea.id;
    this.titulo = tarea.titulo;
    this.descripcion = tarea.descripcion;
    this.estado = tarea.estado;
    this.prioridad = tarea.prioridad;
    this.fecha_de_creacion = tarea.fecha_de_creacion;
    this.fecha_limite = tarea.fecha_limite;

    // Mapear usuario creador si existe
    if (tarea.usuario_creador) {
        this.usuario_creador = {
            id: tarea.usuario_creador.id,
            nombre: tarea.usuario_creador.nombre,
            email: tarea.usuario_creador.email,
        };
    }

    // Mapear usuario asignado si existe
    if (tarea.usuario_asignado) {
        this.usuario_asignado = {
            id: tarea.usuario_asignado.id,
            nombre: tarea.usuario_asignado.nombre,
            email: tarea.usuario_asignado.email,
        };
    }

    // Mapear categoría si existe
    if (tarea.categoria) {
        this.categoria = {
            id: tarea.categoria.id,
            nombre: tarea.categoria.nombre,
        };
        }
    }
}
