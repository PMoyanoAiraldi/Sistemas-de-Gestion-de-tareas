import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { UsuariosService } from "src/usuario/usuario.service";
import { LoginUsuarioDto } from "./dto/login-usuario.dto";


@Injectable()
export class AuthService{
    constructor(private readonly usuariosService: UsuariosService ){}

    async login(credentials: LoginUsuarioDto): Promise<string>{
        try{
        const usuario = await this.usuariosService.encontrarPorEmail(credentials.email);
        if(usuario && usuario.contrasenia === credentials.contrasenia){
            return "Has inciado sesión correctamente"
        }
        throw new UnauthorizedException ("Email o contraseña incorrectos. Por favor intenta nuevamente")
    }catch(error){
        throw new InternalServerErrorException ("Error al iniciar sesión. Por favor intenta nuevamente", error);
    }
}
}