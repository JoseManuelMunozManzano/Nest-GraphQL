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

  // Si estamos en producción o tenemos variable de entorno de puerto,
  // se escucha por el puerto indicado. Si estamos en desarrollo será el 3000.
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });
}
bootstrap();
