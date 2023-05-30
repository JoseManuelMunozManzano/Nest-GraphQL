import { IsArray } from 'class-validator';
import { ArgsType, Field } from '@nestjs/graphql';
import { ValidRoles } from '../../../auth/enums/valid-roles.enum';

// Mi propio tipo personalizado de lo que estoy esperando.
// Para poder decir a GraphQL que este es un tipo de dato en particular:
//  - @ArgsType
//  - Como luce el campo roles, con @Field
@ArgsType()
export class ValidRolesArgs {
  @Field(() => [String], { nullable: true })
  @IsArray()
  roles: string[] = [];
}
