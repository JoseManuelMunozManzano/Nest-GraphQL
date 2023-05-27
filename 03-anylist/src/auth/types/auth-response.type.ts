import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

// To-do lo que retornamos como responses de los requests son object types.
// Desde el front-end se podrán requerir a GraphQL cualquiera de estos campos.
//
// Hay que indicar el decorador @ObjectType()
@ObjectType()
export class AuthResponse {
  @Field(() => String)
  token: string;

  // To-do lo del entity (además es un Object Type) User será seleccionable menos el password,
  // que no es un @Field de GraphQL.
  // Por supuesto, podemos regresar otros Object Types dentro de un Object Type.
  @Field(() => User)
  user: User;
}
