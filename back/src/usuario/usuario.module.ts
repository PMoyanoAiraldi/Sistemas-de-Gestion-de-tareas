import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario } from "./usuario.entity";
import { UsuariosService } from "./usuario.service";
import { UsuariosController } from "./usuario.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Usuario])],
    providers: [ UsuariosService],
    controllers: [UsuariosController],
    exports: [UsuariosService]
})

export class UsuariosModule {}
