import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ⚠️ IMPORTANTE: Habilitar CORS para que el API Gateway pueda acceder
  app.enableCors();

  // Validaciones globales para DTOs
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true 
  }));

  const PORT = process.env.PORT || 4020;
  await app.listen(PORT);
  console.log(`🚀 ms-items running on: http://localhost:${PORT}`);
}
bootstrap();