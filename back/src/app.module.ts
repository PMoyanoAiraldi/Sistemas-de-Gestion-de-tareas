import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { postgresDataSourceConfig } from './config/data_source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuario/usuario.module';
import { CategoriasModule } from './categoria/categoria.module';
import { TareasModule } from './tarea/tarea.module';
import { DataSourceOptions } from 'typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
      load: [ postgresDataSourceConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory:  (configService: ConfigService): DataSourceOptions => {
        const config = configService.get<DataSourceOptions>('postgres');
        if (!config) throw new Error('Postgres config not found');
        return config;
      }
    }),
    UsuariosModule,
    CategoriasModule,
    TareasModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
