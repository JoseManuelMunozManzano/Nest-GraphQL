// Este Resolver lo creamos después del module con el mandato CLI
// nest g r helloWorld --no-spec
import { Float, Query, Resolver } from '@nestjs/graphql';

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
//    hello
//  }
//
// Nos devolverá: {"data": {"Hola Mundo"}}
//
// Otro ejemplo para que se vea que se puede llamar en la misma petición varias veces al mismo query:
// query ObtieneNumeros {
//   rnd1: randomNumber
//   rnd2: randomNumber
//   rnd3: randomNumber
//   rnd4: randomNumber
//   hello
// }
@Resolver()
export class HelloWorldResolver {
  // Además de indicar a nivel TypeScript que esta función devuelve un string, también hay que indicarle a
  // GraphQL que es lo que la función va a regresar.
  //
  // En el decorador @Query podemos indicar el name. Si no se indica, hemos visto en Apollo que coge el nombre
  // de la función.
  // También podemos indicar un descriptivo. Así se puede ir montando la documentación.
  @Query(() => String, {
    description: 'Hola Mundo es lo que retorna',
    name: 'hello',
  })
  helloWorld(): string {
    return 'Hola Mundo';
  }

  // Los tipos de datos que no existen en NodeJs se exportan de @nestjs/graphql
  @Query(() => Float, { name: 'randomNumber' })
  // El number ya es propio de TypeScript.
  getRandomNumber(): number {
    return Math.random() * 100;
  }
}
