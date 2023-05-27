import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

// Lo que me tienen que enviar en la petición es siempre un input.
// Para que GraphQL pueda utilizarlo hay que indicar el decorador @InputType() y que cada
// propiedad es un campo con el decorador @Field()
@InputType()
export class LoginInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @MinLength(6)
  password: string;
}
