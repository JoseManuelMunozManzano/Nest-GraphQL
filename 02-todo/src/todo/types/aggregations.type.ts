import { Field, Int, ObjectType } from '@nestjs/graphql';

// Con @ObjectType definimos objetos personalizados de GraphQL.
// También sirve como va a fluir mi información.
@ObjectType({ description: 'Todo quick aggregations' })
export class AggregationsType {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  pending: number;

  @Field(() => Int)
  completed: number;

  // Ejemplo de deprecado
  @Field(() => Int, { deprecationReason: 'Must use completed instead' })
  totalTodosCompleted: number;
}
