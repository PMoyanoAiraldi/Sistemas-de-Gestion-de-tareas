import { Body, Controller, Delete, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { CategoriasService } from "./categoria.service";
import { CrearCategoriaDto } from "./dto/crear-categoria.dto";
import { RespuestaCategoriaDto } from "./dto/respuesta-categoria.dto";
import { Categoria } from "./categoria.entity";
import { ModificarCategoriaDto } from "./dto/modificar-categoria.dto";

@Controller("categorias")
export class CategoriasController {
    constructor(
            private readonly categoriasService: CategoriasService,
    ) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async crearCategoria(@Body() crearCategoriaDto: CrearCategoriaDto): Promise<RespuestaCategoriaDto> {
        const categoria = await this.categoriasService.create(crearCategoriaDto);
        return categoria;
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async modificarCategoria(
    @Param('id') id: string, 
    @Body() modificarCategoria: ModificarCategoriaDto): Promise<Categoria>{
    try {
        const categoria = await this.categoriasService.modificarCategoria(id, modificarCategoria);
        if (!categoria) {
            throw new NotFoundException('Categoria no encontrada');
        }
        return categoria;
    } catch (error) {
        console.error('Error al actualizar el categoria:', error);
        throw new InternalServerErrorException('Error inesperado al actualizar la categoria');
    }
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async obtenerCategoria(@Param('id') id: string): Promise<Categoria> {
        return this.categoriasService.obtenerCategoriaPorId(id);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async obtenerCategorias(): Promise<RespuestaCategoriaDto[]> {
    return this.categoriasService.obtenerCategorias();

    }
    
    @Delete(':id')
        // @UseGuards(AuthGuard, RolesGuard)
        // @Roles('admin')
        // @ApiSecurity('bearer')
    @HttpCode(HttpStatus.OK)
    async eliminarCategoria(@Param('id') id: string): Promise<{ id: string }> {
    const resultado = await this.categoriasService.eliminarCategoria(id)
    if (!resultado) {
        throw new NotFoundException(`Categoria con ${id} no fue encontrada`);
    }
    
    return { id }
    }
}

