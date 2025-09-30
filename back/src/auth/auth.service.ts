import { ForbiddenException, HttpException, HttpStatus, Injectable} from "@nestjs/common";
import { LoginUsuarioDto } from "./dto/login-usuario.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "src/usuario/usuario.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuariosRepository: Repository<Usuario>,
        private readonly jwtService: JwtService,
    
        
    ) { }
    async login(loginUsuario: LoginUsuarioDto): Promise<{ usuario: Partial<Usuario>, token: string }> {
        const usuario = await this.usuariosRepository.findOne({ 
            where: {email: loginUsuario.email},
        });
        console.log('Usuario encontrado:', usuario);

        if (!usuario) {
            throw new HttpException('Email o contraseña incorrecto', HttpStatus.UNAUTHORIZED);
        }

        // Verificar si el usuario está habilitado
        if (!usuario.estado) {
            throw new ForbiddenException('Tu cuenta está suspendida. Contacta al administrador.');
        }

        const contraseniaCoincide = usuario && await bcrypt.compare(loginUsuario.contrasenia, usuario.contrasenia);

        console.log('Contraseña recibida en el login:', loginUsuario.contrasenia);
        console.log('Contraseña coincide:', contraseniaCoincide);

        if (!contraseniaCoincide) {
            throw new HttpException('Email o contraseña incorrecto', HttpStatus.UNAUTHORIZED);
        }

        const token = await this.createToken(usuario);
        const { ...usuarioSinContrasenia} = usuario;

        return {
            usuario: usuarioSinContrasenia,
            token,
        };

    }

    private async createToken(usuario: Usuario) {
        const payload = {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            rol: usuario.rol
        };
        return this.jwtService.signAsync(payload)
    }
}