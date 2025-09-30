import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor (private readonly reflector : Reflector){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(), 
            context.getClass()]);
            
    if (!requiredRoles) {
        return true;
    }

    const request = context.switchToHttp().getRequest<any>();
    const usuario = request.user;

    // Verifica si el rol del usuario está dentro de los roles requeridos
    if (!requiredRoles.includes(usuario.rol)) {
        throw new ForbiddenException('No tienes los permisos necesarios');
    }

    return true;
    
    }
}