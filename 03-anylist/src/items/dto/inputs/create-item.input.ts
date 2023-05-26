import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

// @InputType() indica a GraphQL que campos son los que vamos a permitir recibir.
// Puede mezclarse con el ClassValidator para indicar las restricciones de como queremos que vengan
// esos campos.
@InputType()
export class CreateItemInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  // Si quisiera el valor 0 en vez de @IsPositive() indicaría @Min(0)
  @Field(() => Float)
  @IsPositive()
  quantity: number;

  // Optativo para TypeScript con ?
  // Optativo para GraphQL con {nullable: true}
  // Optativo para ClassValidator con @IsOptional()
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  quantityUnits?: string;
}
