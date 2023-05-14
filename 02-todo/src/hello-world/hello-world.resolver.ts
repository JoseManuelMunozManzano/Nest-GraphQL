// Este Resolver lo creamos después del module con el mandato CLI
// nest g r helloWorld --no-spec
import { Query, Resolver } from '@nestjs/graphql';

// Proveen las instrucciones para transformar las instrucciones provenientes del cliente en data que GraphQL
// puede utilizar. Los resolvers son similares a los controladores tradicionales de un REST endpoint con Nest,
// pero son técnicamente “providers”.
// Ver: https://docs.nestjs.com/graphql/resolvers
//
// Nuestro endpoint será: http://localhost:3000/graphql
// Con esto accedemos al playground (En app.module.ts la propiedad playground NO puede estar a false)
// Un ejemplo de query sería:
//  query {
//      helloWorld
//        }
//
// Nos devolverá: {"data": {"Hola Mundo"}}
//
// Otro ejemplo, renombrando, sería:
//  query {
//      hola: helloWorld
//        }
//
// Nos devolverá: {"data": {"hola": "Hola Mundo"}}
//
// Indicar que la palabra query es opcional, por ejemplo, esto funciona perfectamente:
//  {
//    helloWorld
//  }
//
// Si pulsamos en la pestaña lateral DOCS, veremos que se va generando la documentación automáticamente.
@Resolver()
export class HelloWorldResolver {
  // Además de indicar a nivel TypeScript que esta función devuelve un string, también hay que indicarle a
  // GraphQL que es lo que la función va a regresar.
  @Query(() => String)
  helloWorld(): string {
    return 'Hola Mundo';
  }
}
