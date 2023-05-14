// Este Resolver lo creamos después del module con el mandato CLI
// nest g r helloWorld --no-spec
import { Query, Resolver } from '@nestjs/graphql';

// Proveen las instrucciones para transformar las instrucciones provenientes del cliente en data que GraphQL
// puede utilizar. Los resolvers son similares a los controladores tradicionales de un REST endpoint con Nest,
// pero son técnicamente “providers”.
// Ver: https://docs.nestjs.com/graphql/resolvers
//
// Nuestro endpoint será: http://localhost:3000/graphql
// Con esto accedemos a Apollo (En app.module.ts la propiedad playground TIENE que estar a false)
//
// Un ejemplo de query sería:
//  {
//    helloWorld
//  }
//
// Nos devolverá: {"data": {"Hola Mundo"}}
@Resolver()
export class HelloWorldResolver {
  // Además de indicar a nivel TypeScript que esta función devuelve un string, también hay que indicarle a
  // GraphQL que es lo que la función va a regresar.
  @Query(() => String)
  helloWorld(): string {
    return 'Hola Mundo';
  }
}
