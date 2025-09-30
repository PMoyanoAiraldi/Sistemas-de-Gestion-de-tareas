import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../usuario/usuario.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly usuariosService: UsuariosService, // Inyectamos el servicio de usuarios
  ) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token JWT del encabezado de autorización
      ignoreExpiration: false, // Verifica que el token no esté expirado
      secretOrKey: secret, // Utiliza la clave secreta para verificar el token
    });
  }

  // Este método se ejecuta si el token es válido
  async validate(payload: { sub: string; email: string }) {
    // Extraemos el userId del payload
    const  userId  = payload.sub;

    // Buscamos el usuario en la base de datos por su id
    const usuario = await this.usuariosService.obtenerUsuarioPorId(userId); // Debes tener un método en tu servicio de usuarios que obtenga el usuario por su id

    // Si el usuario no existe, lanzamos una excepción
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

      return {
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol, 
    };
  }
}

