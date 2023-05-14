import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Instalaciones para validaciones de la request con respecto a nuestros DTOs:
  // yarn add class-validator class-transformer
  // Si la información no viene como indican nuestros DTO's no la va a dejar pasar (excepción).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3001);
}
bootstrap();
