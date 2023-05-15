// Este Resolver lo creamos después del module con el mandato CLI
// nest g r helloWorld --no-spec
import { Args, Float, Int, Query, Resolver } from '@nestjs/graphql';

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

  // Mandando argumentos: es información adicional que se puede proveer en los queries. Puede estar presente
  // en varios niveles del query para aplicar filtros o condiciones especiales.
  // https://graphql.org/learn/queries/#arguments
  //
  // Para indicar que es un argumento de GraphQL se usa el decorador @Args('nombre', {type: () => tipo_dato})
  // El nombre informado en @Args no tiene por qué ser el mismo que el de la variable de la función. Ese 'nombre'
  // es el de GraphQL.
  // El type se indica porque sin él el argumento to puede ser un Float, ya que es un number, pero nosotros queremos que sea solo Int.
  // Es {type: () => Int}, como una función, porque es computado en el momento en el que se hace la petición.
  //
  // Para usar un valor por defecto, ya esto es algo JavaScript, pero por si solo no funciona porque hay que decirle a
  // GraphQL que el argumento to es opcional (por defecto es obligatorio) Para ello, indicar la opción nullable a true.
  @Query(() => Int, {
    name: 'randomFromZeroTo',
    description: 'From zero to argument TO (default 6)',
  })
  getRandomFromZeroTo(
    @Args('to', { nullable: true, type: () => Int }) to: number = 6,
  ): number {
    return Math.floor(Math.random() * to);
  }
}
