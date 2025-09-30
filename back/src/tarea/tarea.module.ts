import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tarea } from "./tarea.entity";
import { TareasService } from "./tarea.service";
import { TareasController } from "./tarea.controller";
import { Usuario } from "src/usuario/usuario.entity";
import { Categoria } from "src/categoria/categoria.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Tarea, Usuario, Categoria])],
    providers: [ TareasService],
    controllers: [TareasController],
    exports: [TareasService]
})

export class TareasModule {}
