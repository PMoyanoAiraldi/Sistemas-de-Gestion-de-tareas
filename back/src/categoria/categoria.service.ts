import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository } from "typeorm";
import { Categoria } from "./categoria.entity";
import { CrearCategoriaDto } from "./dto/crear-categoria.dto";
import { ModificarCategoriaDto } from "./dto/modificar-categoria.dto";

@Injectable()
export class CategoriasService{
    constructor(
        @InjectRepository(Categoria)
        private readonly categoriaRepository: Repository<Categoria>,
    ) {}

    async create(crearCategoriaDto: CrearCategoriaDto): Promise<Categoria> {
        try{
        
        const normalizarNombre = crearCategoriaDto.nombre.trim().toLowerCase();

        const existeCategoria = await this.categoriaRepository
        .createQueryBuilder('categoria')
        .where('LOWER(categoria.nombre) = :nombre', { nombre: normalizarNombre })
        .getOne();

    if (existeCategoria) {
        throw new HttpException(`La categoría "${crearCategoriaDto.nombre}" ya existe.`, HttpStatus.BAD_REQUEST);
    }

    const categoria = this.categoriaRepository.create({
        nombre: crearCategoriaDto.nombre.trim(), 
    });
    console.log("Categoria antes de ser guardada", categoria)

    return await this.categoriaRepository.save(categoria);
} catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
        // Error de unicidad detectado (código específico de PostgreSQL)
        throw new HttpException(
            'Ya existe una categoría con ese nombre.',
            HttpStatus.BAD_REQUEST,
        );
    }
    // Si el error no es de unicidad, lánzalo tal como está
    throw error;
}
    }

    async obtenerCategorias(): Promise<Categoria[]> {
        return await this.categoriaRepository.find();
    }


    async obtenerCategoriaPorId(id: string): Promise<Categoria> {
        const categoria = await this.categoriaRepository.findOne({ where: { id } });
        if (!categoria) {
            throw new NotFoundException(`Categoria con ID ${id} no encontrada`);
        }
        return categoria;
    }


    async modificarCategoria(id: string, modificarCategoriaDto: ModificarCategoriaDto): Promise<Categoria> {
        
        const categoria = await this.categoriaRepository.findOne({ where: { id } });
        if (!categoria) {
        throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
        } 

        if (!modificarCategoriaDto.nombre && !modificarCategoriaDto.estado) {
            throw new BadRequestException('No se proporcionaron datos para actualizar la categoría.');
        }
        
        if (modificarCategoriaDto.nombre) {
            const normalizarNombre = modificarCategoriaDto.nombre.trim().toLowerCase();
            
            const existeCategoria = await this.categoriaRepository.findOne({
                where: { nombre: normalizarNombre},
            });
            if (existeCategoria && existeCategoria.id !== id) {
                throw new BadRequestException(`El nombre de la categoría "${modificarCategoriaDto.nombre}" ya existe`);
            }

            
            if (categoria.nombre.toLowerCase() === normalizarNombre) {
                throw new BadRequestException(`El nombre de la categoría "${modificarCategoriaDto.nombre}" ya existe`);
            }

            categoria.nombre = modificarCategoriaDto.nombre.trim();
        }

        try {
            return await this.categoriaRepository.save(categoria);
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
                throw new HttpException(
                    'Ya existe una categoría con ese nombre.',
                    HttpStatus.BAD_REQUEST,
                );
            }
            throw error;
    }
}


async eliminarCategoria(id: string): Promise<string> {
        const categoria = await this.categoriaRepository.findOne({ where: { id } });
        if (!categoria) {
            throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
        }
        const nombreCategoria = categoria.nombre;
        await this.categoriaRepository.remove(categoria);
        return `Categoría "${nombreCategoria}" eliminada exitosamente`;
    }
}

