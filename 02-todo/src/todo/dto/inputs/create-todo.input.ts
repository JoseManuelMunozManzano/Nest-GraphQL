import { Field, InputType } from '@nestjs/graphql';

// Datos que esperamos para crear un nuevo Todo.
// Para decirle a GraphQL que esto es un input, indicamos el decorador @InputType
@InputType()
export class CreateTodoInput {
  @Field(() => String, { description: 'What needs to be done' })
  description: string;
}
