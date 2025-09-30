import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: true, // Evita validar propiedades no enviadas
      skipUndefinedProperties: true, // Ignora campos que no están definidos
    }),
  );

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'; 
  console.log({ frontendUrl });

  app.enableCors({
    origin: frontendUrl,  
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  
    allowedHeaders: 'Authorization,Content-Type, Accept',
    maxAge: 3600,
  });

  await app.listen(3000);
}

bootstrap();
