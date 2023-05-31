import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesArgs } from './dto/args/roles.arg';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

// Protección de ruta a nivel de clase usando @UseGuards. Solo usuarios autenticados.
@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // Esto deberá estar validado y será para roles de administrador.
  //
  // Recibir información de cuales son los roles que me interesan. Se hace con @Args.
  // Recordar que la diferencia entre @Args e @Input es que los @Input vienen como si fueran peticiones
  // POST o PUT, es decir, body. Los @Args es como si fueran query parameters en una petición GET.
  //
  // Le vamos a decir a GraphQL como va a lucir validRoles. Para eso vamos a crear un argumento personalizado,
  // llamado roles.args.ts
  //
  // IMPORTANTE: Si en vez de indicar tipo ValidRolesArgs dijéramos String, entonces dentro de @Args() tendríamos
  // que indicar el nombre, de la siguiente forma: @Args('validRoles')
  // Como el tipo es uno personalizado, ValidRolesArgs, no hace falta hacer esto en @Args porque el nombre
  // ya aparece en VaridRolesArgs.
  //
  // Solo usuarios con rol admin pueden hacer el findAll()
  // Para esto usamos nuestro @CurrentUser indicando el rol.
  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User[]> {
    console.log({ validRoles });
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<User> {
    // TODO
    throw new Error('Not implemented');
    // return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  blockUser(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.usersService.block(id);
  }
}
