import { Body, Controller, Delete, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post, Put, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { TareasService } from "./tarea.service";
import { CrearTareaDto } from "./dto/crear-tareas.dto";
import { RespuestaTareaDto } from "./dto/respuesta-tarea.dto";
import { ModificarTareaDto } from "./dto/modificar-tarea.dto";
import { Tarea } from "./tarea.entity";
import { AuthGuard } from "src/guard/auth.guard";
import { Roles } from "../decorators/roles.decorator";
import { RolesGuard } from "src/guard/roles.guard";

interface RequestWithUser extends Request {
    user: {
        id: string;
        nombre:string;
        email: string;
        rol: string;
    };
}



@Controller("tareas")
export class TareasController {
    constructor(
                private readonly tareasService: TareasService,
        ) { }
    @Post()
    @HttpCode(HttpStatus.OK)
    async crearTarea(@Body() crearTareaDto: CrearTareaDto): Promise<RespuestaTareaDto> {
        const tarea = await this.tareasService.crearTarea(crearTareaDto);
        return tarea;
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async modificarTarea(
    @Param('id') id: string, 
    @Body() modificarTarea: ModificarTareaDto): Promise<RespuestaTareaDto>{
    try {
        const tarea = await this.tareasService.modificarTarea(id, modificarTarea);
        if (!tarea) {
            throw new NotFoundException('Tarea no encontrada');
        }
        return tarea;
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        throw new InternalServerErrorException('Error inesperado al actualizar la tarea');
    }
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async obtenerTarea(@Param('id') id: string): Promise<Tarea> {
        return this.tareasService.obtenerTareaPorId(id);
    }

    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'usuario')
    @HttpCode(HttpStatus.OK)
    async obtenerTareas(@Req() req: RequestWithUser): Promise<Tarea[]> {
    const usuario = req.user; // Usuario del token JWT
    
    if (!usuario || !usuario.id) {
        throw new UnauthorizedException('Usuario no autenticado');
    }
    
    // Si es admin, devuelve todas las tareas
    if (usuario.rol === 'admin') {
        return this.tareasService.obtenerTareas();
    }
    
    // Si es usuario común, solo sus tareas
    return this.tareasService.obtenerTareasPorUsuario(usuario.id);

    }
    
    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @HttpCode(HttpStatus.OK)
    async eliminarTarea(@Param('id') id: string): Promise<{ id: string }> {
    const resultado = await this.tareasService.eliminarTarea(id)
    if (!resultado) {
        throw new NotFoundException(`Tarea con ${id} no fue encontrada`);
    }
    
    return { id }
    }
}

