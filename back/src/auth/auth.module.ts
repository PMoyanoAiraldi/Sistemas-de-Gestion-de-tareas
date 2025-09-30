import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsuariosService } from "src/usuario/usuario.service";
import { Usuario } from "src/usuario/usuario.entity";
import { TypeOrmModule } from "@nestjs/typeorm";



@Module({
    imports: [TypeOrmModule.forFeature([Usuario])],
    providers: [AuthService, UsuariosService],
    controllers: [AuthController],
})
export class AuthModule{}