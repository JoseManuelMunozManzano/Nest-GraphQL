import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Int,
  Parent,
} from '@nestjs/graphql';

import { UsersService } from './users.service';
import { ItemsService } from '../items/items.service';

import { User } from './entities/user.entity';
import { Item } from './../items/entities/item.entity';

import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { PaginationArgs, SearchArgs } from './../common/dto/args';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

// Protección de ruta a nivel de clase usando @UseGuards. Solo usuarios autenticados.
@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
  ) {}

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
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  // Vamos a hacer una pequeña modificación a nuestro esquema para indicarle que hay una nueva propiedad calculada
  // que puede ser consultada (la cantidad de items por usuario)
  // Cuando alquien consulta esa propiedad en Apollo, GraphQL me va a decir el método que se va a ejecutar cuando
  // se reciba esa solicitud (itemCount()).
  // NO ESTA EN BD, ES CALCULADO!!!
  //
  // ¿Cómo sabemos el usuario? Como este campo se encuentra dentro del objeto users (su padre), nosotros tenemos
  // acceso a toda su información en cualquiera de las propiedades que creemos.
  // Para obtener esa información se usa el decorador @Parent
  //
  // Si en GraphQL no se pide este campo (itemCount) entonces este método no se ejecuta.
  // Y como está atado al usuario, en cualquier query donde este el user, podremos pedir la información de este campo,
  // por ejemplo en la query findOneItem
  @ResolveField(() => Int, { name: 'itemCount' })
  async itemCount(
    @CurrentUser() adminUser: User,
    @Parent() user: User,
  ): Promise<number> {
    // Hemos inyectado itemsService porque esta cuenta de items le corresponde hacerlo al módulo de items.
    return this.itemsService.itemCountByUser(user);
  }

  // Custom Resolver para añadir los items al user, pero como nosotros queramos, en este caso para
  // aplicar filtros de paginación y búsqueda.
  // El name es 'items', igual que tenemos en el nombre del campo en user.entity.ts,
  // aunque no es obligatorio que se llame igual.
  //
  // Ahora, en cualquier query donde se pidan los items, y donde el padre sea user, tendremos la
  // posibilidad de tener estos filtros de paginación y búsqueda.
  @ResolveField(() => [Item], { name: 'items' })
  async getItemsByUser(
    @CurrentUser() adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Item[]> {
    return this.itemsService.findAll(user, paginationArgs, searchArgs);
  }
}
