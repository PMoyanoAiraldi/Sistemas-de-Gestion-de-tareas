import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface JwtPayload {
  sub: string;
  email: string;
  rol?: string;
  iat: number;
  exp: number;
}

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const request: Request = context.switchToHttp().getRequest<RequestWithUser>() 
    const token = this.extractTokenFromHeader(request)

    if(!token){
      throw new UnauthorizedException('El token no fue encontrado')
    }

    try{

      const secret = this.configService.get<string>('JWT_SECRET');
      
      if (!secret) {
        throw new Error('JWT_SECRET no configurado');
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: secret 
      });
      
      request.user = {
        ...payload,
        iat: payload.iat,
        exp: payload.exp
      };
      console.log('Payload', {
        ...payload,
        iat: new Date(payload.iat * 1000),
        exp: new Date(payload.exp * 1000)
      });
    }catch{
      throw new UnauthorizedException('Token invalido')
    }
    return true
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined
  }
}