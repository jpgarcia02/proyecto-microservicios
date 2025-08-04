import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para que el gateway o cualquier cliente acceda
  app.enableCors();

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Quita propiedades no declaradas en DTO
      forbidNonWhitelisted: true, // Lanza error si envían propiedades desconocidas
      transform: true, // Convierte automáticamente tipos según DTO
    }),
  );

  // Leer puerto desde variables de entorno
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4010;

  await app.listen(port);
  console.log(`🚀 ms-users running on: http://localhost:${port}`);
}
bootstrap();
