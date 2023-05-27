import { IsUUID } from 'class-validator';
import { CreateItemInput } from './create-item.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

// Mandamos siempre el id.
// A diferencia de un RESTFul tradicional no mandamos por el url el id, se manda en el body del request.
// PartialType lo que hace es incluir todo las propiedades que tiene CreateItemInput y los hace opcionales,
// para no tener que volver a definirlas aquí.
@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  // No olvidar nuestro class validator para que no falle GraphQL. Si no se indica, el error es
  // property id should not exist y Bad Request.
  //
  // NOTA IMPORTANTE: Si empezamos con los decoradores de GraphQL (@Field) entonces siempre, en toda la app
  // poner primero ese indicador. O al revés si empezamos con class validator, pero ser consistentes.
  @Field(() => ID)
  @IsUUID()
  id: string;
}
