import { Module } from '@nestjs/common';

// Indicar que se pueden mezclar controladores con GraphQL.
// Se puede tener un controlador (un endpoint) que sea /graphql y dentro tener todas nuestras queries y mutations.
// Se puede hacer con el login por ejemplo.
// Como siempre, todo dependiendo de las necesidades del proyecto.
@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
