import { IsArray } from 'class-validator';
import { ArgsType, Field } from '@nestjs/graphql';
import { ValidRoles } from '../../../auth/enums/valid-roles.enum';

// Mi propio tipo personalizado de lo que estoy esperando.
// Para poder decir a GraphQL que este es un tipo de dato en particular:
//  - @ArgsType
//  - Como luce el campo roles, con @Field
@ArgsType()
export class ValidRolesArgs {
  // Tenemos que indicar a GraphQL que tipo de dato es ValidRoles.
  // Cuando estamos trabajando con un tipo de decorador que es propio de GraphQL, como @Field en este caso,
  // tenemos que trabajar con tipos propios o tipos personalizados de GraphQL.
  // Por eso tenemos que hacer que ValidRoles, una enumeración TypeScript, sea también una enumeración
  // GraphQL.
  //
  // Nos faltaba decirle a TS que roles es de tipo ValidRoles.
  @Field(() => [ValidRoles], { nullable: true })
  @IsArray()
  roles: ValidRoles[] = [];
}
