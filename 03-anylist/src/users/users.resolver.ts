import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesArgs } from './dto/args/roles.arg';

@Resolver(() => User)
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
  @Query(() => [User], { name: 'users' })
  findAll(@Args() validRoles: ValidRolesArgs): Promise<User[]> {
    console.log({ validRoles });
    return this.usersService.findAll();
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
