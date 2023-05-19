import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

// Datos que esperamos para crear un nuevo Todo.
// Para decirle a GraphQL que esto es un input, indicamos el decorador @InputType
@InputType()
export class CreateTodoInput {
  @Field(() => String, { description: 'What needs to be done' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Transform(({ value }) => value.trim())
  description: string;
}
