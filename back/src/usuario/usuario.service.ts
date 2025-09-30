import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "./usuario.entity";
import { Repository } from "typeorm";
import { CrearUsuarioDto } from "./dto/crear-usuario.dto";
import * as bcrypt from 'bcrypt';
import { ModificarUsuarioDto } from "./dto/modificar-usuario.dto";
import { RespuestaUsuarioDto } from "./dto/respuesta-usuario.dto";

@Injectable()
export class UsuariosService{
    constructor(
        @InjectRepository(Usuario)
        private readonly usuariosRepository: Repository<Usuario>,
){}


async crearUsuario(crearUsuario: CrearUsuarioDto): Promise <Usuario>{
    try{
        console.log('Datos recibidos:', crearUsuario);
        const usuarioExiste = await this.usuariosRepository.findOne({ where: { email: crearUsuario.email } });
        if (usuarioExiste) {
            throw new HttpException('El usuario ya está registrado', 400);
    }

        const nuevoUsuario = new Usuario();
        Object.assign(nuevoUsuario, crearUsuario);
        console.log('Usuario antes de guardar:', nuevoUsuario);

        const hashedcontrasenia = await bcrypt.hash(crearUsuario.contrasenia, 10);
        nuevoUsuario.contrasenia = hashedcontrasenia;// Asignar la contraseña encriptada al nuevo usuario
        console.log('Hashed contrasenia:', nuevoUsuario.contrasenia);

        const usuarioGuardado = await this.usuariosRepository.save(nuevoUsuario)
        console.log('Usuario guardado en la BD:', usuarioGuardado);
            return usuarioGuardado
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            if (error instanceof HttpException) {
                throw error; 
            }
            throw new HttpException('Error al crear el usuario', 500);
        }
}

    async obtenerUsuarioPorId(id: string): Promise<RespuestaUsuarioDto | null>{
        const usuario = await this.usuariosRepository.findOne({ where: { id } });
        
        if (!usuario) {
        return null;
    }
    

    const respuestaDto = new RespuestaUsuarioDto();

    respuestaDto.nombre = usuario.nombre;
    respuestaDto.email = usuario.email;
    
    return respuestaDto;
}

    async obtenerUsuarios(): Promise<RespuestaUsuarioDto[]>{
        return this.usuariosRepository.find();
    }


    async modificarUsuario(id: string, modificarUsuario: ModificarUsuarioDto): Promise<Usuario>{
        const usuario = await this.usuariosRepository.findOne({ where: { id } });
        if (!usuario) {
            throw new Error(`Usuario con ${id} no fue encontrado`);
        }

        // Si la contraseña está presente, encriptarla
        if (modificarUsuario.contrasenia) {
            const salt = await bcrypt.genSalt(10);
            modificarUsuario.contrasenia = await bcrypt.hash(modificarUsuario.contrasenia, salt);
        }

        // Crear un objeto con los campos actuales del usuario, y solo sobrescribir los que se pasen en el DTO
        const datosActualizados = {
            nombre: modificarUsuario.nombre || usuario.nombre,  
            email: modificarUsuario.email || usuario.email,      
            contrasenia: modificarUsuario.contrasenia || usuario.contrasenia, 
            esAdmin: modificarUsuario.esAdmin || usuario.esAdmin,   
            estado: modificarUsuario.estado || usuario.estado
    };
        
        // Guardar los cambios en la base de datos
        await this.usuariosRepository.save({ ...usuario, ...datosActualizados });

        return { ...usuario, ...datosActualizados };
    }

    async eliminarUsuario(id: string): Promise<string>{
        const usuario = await this.usuariosRepository.findOne({ where: {id}});
        if(!usuario){
            throw new Error(`El usuario con ${id} no fue encontrado`);
        }
        await this.usuariosRepository.remove(usuario);
        return id;
    }

    async encontrarPorEmail(email: string){
        return this.usuariosRepository.findOne({ where: {email}})
    }
    
}