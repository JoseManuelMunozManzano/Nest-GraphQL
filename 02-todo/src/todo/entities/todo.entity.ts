import { Field, Int, ObjectType } from '@nestjs/graphql';

// Así lucirá un registro en nuestra BD.
// Con el decorador @ObjectType podemos crear tipos personalizados para GraphQL, como si fuera un String o un Float de GraphQL.
@ObjectType()
export class Todo {
  // Decoradores adicionales para GraphQL.
  // Con @Field indicamos el tipo de dato.
  // Se indica name a 'id' como ejemplo de que podría cambiarse el nombre y para GraphQL sería ese nombre.
  @Field(() => Int, { name: 'id' })
  id: number;

  @Field(() => String)
  description: string;

  @Field(() => Boolean)
  done: boolean = false;
}
