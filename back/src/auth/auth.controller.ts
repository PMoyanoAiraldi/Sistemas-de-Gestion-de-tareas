import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUsuarioDto } from "./dto/login-usuario.dto";

@Controller('auth') 
export class AuthController{
    constructor(private readonly authService: AuthService) {} 

    @Post('login')
    signIn(@Body() credentials: LoginUsuarioDto){
        return this.authService.login(credentials)
    }
}