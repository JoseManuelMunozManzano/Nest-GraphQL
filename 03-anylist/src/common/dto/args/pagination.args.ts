import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, Min } from 'class-validator';

// Con el decorador @ArgsType indicamos que es un Argument Type. Sin esto GraphQL no sabría que es.
// Además, también para GraphQL no olvidar declarar los @Field()
// Y por último, la validación de classValidator.
@ArgsType()
export class PaginationArgs {
  // Los elementos que salta antes de empezar a mostrar
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0)
  offset = 0;

  // La paginación por defecto es de 10 en 10
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  limit = 10;
}
