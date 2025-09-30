import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { Usuario } from "src/usuario/usuario.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsuariosModule } from "src/usuario/usuario.module";
import { SharedModule } from "src/shared/shared.module";
import { JwtStrategy } from "./jwtStrategy";



@Module({
    imports: [UsuariosModule,SharedModule, TypeOrmModule.forFeature([Usuario])],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule{}