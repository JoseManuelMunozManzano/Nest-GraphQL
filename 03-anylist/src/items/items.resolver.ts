import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';

import { ItemsService } from './items.service';

import { Item } from './entities/item.entity';
import { User } from './../users/entities/user.entity';

import { UpdateItemInput, CreateItemInput } from './dto/inputs';
import { PaginationArgs, SearchArgs } from './../common/dto/args';

import { CurrentUser } from './../auth/decorators/current-user.decorator';

// Para tener acceso al usuario (cuyo ID tenemos en el token) usamos nuestro @UseGuards(JwtAuthGuard)
// Necesito por tanto estar autenticado.
@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  // Cualquier interacción con la BD es asíncrona, por lo que indicamos async - await y como salida Promise<Item>
  //
  // Y aquí, obtenemos todos los datos del usuario para poder insertarlo junto al item. Usamos nuestro decorador @CurrentUser()
  @Mutation(() => Item, { name: 'createItem' })
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() user: User,
  ): Promise<Item> {
    return this.itemsService.create(createItemInput, user);
  }

  // Añadimos paginación
  // Añadimos búsqueda
  // Cuando hay más de un @Args no funciona correctamente. GraphQL dirá que las propiedades del primer @Args
  // no deberían existir porque son sobreescritas por las propiedades del segundo @Args.
  // El problema viene del class validator. Ver main.ts
  @Query(() => [Item], { name: 'items' })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Item[]> {
    // console.log({ paginationArgs, searchArgs });
    return this.itemsService.findAll(user, paginationArgs);
  }

  // Indicar que para GraphQL existe el tipo ID.
  // También se puede mezclar con el Pipe que valida que sea un UUID válido. Con esto, si no mandamos
  // un UUID obtenemos como response un BAD REQUEST
  @Query(() => Item, { name: 'item' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Item> {
    return this.itemsService.findOne(id, user);
  }

  @Mutation(() => Item)
  async updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @CurrentUser() user: User,
  ): Promise<Item> {
    return this.itemsService.update(updateItemInput.id, updateItemInput, user);
  }

  @Mutation(() => Item)
  async removeItem(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Item> {
    return this.itemsService.remove(id, user);
  }
}
