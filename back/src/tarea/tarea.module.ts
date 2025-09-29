import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tarea } from "./tarea.entity";
import { TareasService } from "./tarea.service";
import { TareasController } from "./tarea.controller";


@Module({
    imports: [TypeOrmModule.forFeature([Tarea])],
    providers: [ TareasService],
    controllers: [TareasController],
    exports: [TareasService]
})

export class TareasModule {}
