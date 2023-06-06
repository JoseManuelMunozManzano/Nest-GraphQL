import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';

import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';

import { ListItem } from './entities/list-item.entity';
import { ListItemService } from './list-item.service';

// To-do nuestro endpoint requiere que el usuario esté autenticado, de ahí el uso del @UserGuards
@Resolver(() => ListItem)
@UseGuards(JwtAuthGuard)
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) {}

  @Mutation(() => ListItem)
  createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput,
    //! Todo pueden pedir el usuario para validar. No se va a hacer porque por temas didácticos no
    //! vamos a estar repitiendo siempre lo mismo.
  ): Promise<ListItem> {
    return this.listItemService.create(createListItemInput);
  }

  // No lo vamos a hacer porque para saber los items que tiene una lista
  // ya lo podemos saber haciendo la query sobre la lista.
  //
  // @Query(() => [ListItem], { name: 'listItem' })
  // findAll() {
  //   return this.listItemService.findAll();
  // }

  @Query(() => ListItem, { name: 'listItem' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<ListItem> {
    return this.listItemService.findOne(id);
  }

  // @Mutation(() => ListItem)
  // updateListItem(
  //   @Args('updateListItemInput') updateListItemInput: UpdateListItemInput,
  // ) {
  //   return this.listItemService.update(
  //     updateListItemInput.id,
  //     updateListItemInput,
  //   );
  // }

  // @Mutation(() => ListItem)
  // removeListItem(@Args('id', { type: () => Int }) id: number) {
  //   return this.listItemService.remove(id);
  // }
}
