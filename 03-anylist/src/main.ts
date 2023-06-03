import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Para tener validaciones y transformaciones instalamos
  // yarn add class-validator class-transformer
  // Y configuramos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // Comentada porque si no, cuando hay varios @Args seguidos en un método, solo funciona el último.
      // Esta propiedad es para que no me den más información de la que espero, y es importante, pero GraphQL
      // nos hace ya esta validación por lo que aquí no es necesario.
      // Para RESTFul si que es muy importante dejarla a true. Y si mezclamos GraphQL con RESTFul entonces,
      // podemos configurar el pipe en el módulo que use REST.
      // forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
