import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { UsuariosService } from "./usuario.service";
import { CrearUsuarioDto } from "./dto/crear-usuario.dto";
import { ModificarUsuarioDto } from "./dto/modificar-usuario.dto";
import { Usuario } from "./usuario.entity";
import { RespuestaUsuarioDto } from "./dto/respuesta-usuario.dto";


@Controller("usuarios")
export class UsuariosController {
constructor(
        private readonly usuariosService: UsuariosService,
    ) { }

@Post('registrar')
@HttpCode(HttpStatus.CREATED)
    async crearUsuario(@Body() crearUsuario: CrearUsuarioDto) {
    const usuario = await this.usuariosService.crearUsuario(crearUsuario)
        return {
            message: `Cliente creado exitosamente`, usuario
        };
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async modificarUsuarios(
        @Param('id') id: string, 
        @Body() modificarUsuarios: ModificarUsuarioDto): Promise<Usuario>{
        try {
            const usuario = await this.usuariosService.modificarUsuario(id, modificarUsuarios);
            if (!usuario) {
                throw new NotFoundException('Usuario no encontrado');
            }
            return usuario;
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            throw new InternalServerErrorException('Error inesperado al actualizar el usuario');
        }
    }
    
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async obtenerUsuario(@Param('id', new ParseUUIDPipe()) id: string): Promise<RespuestaUsuarioDto>{
        const usuario = await this.usuariosService.obtenerUsuarioPorId(id)
        if(!usuario){
            throw new HttpException('El usuario no fue encontrado', HttpStatus.NOT_FOUND)
        }
        return usuario
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async obtenerUsuarios(): Promise<RespuestaUsuarioDto[]> {
        return this.usuariosService.obtenerUsuarios();

    }

    @Delete(':id')
    // @UseGuards(AuthGuard, RolesGuard)
    // @Roles('admin')
    // @ApiSecurity('bearer')
    @HttpCode(HttpStatus.OK)
    async eliminarUsuarios(@Param('id') id: string): Promise<{ id: string }> {
        const resultado = await this.usuariosService.eliminarUsuario(id)
        if (!resultado) {
            throw new NotFoundException(`Usuario con ${id} no fue encontrado`);
        }

        return { id }
    }

}