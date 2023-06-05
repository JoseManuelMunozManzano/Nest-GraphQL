import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

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

  // @Query(() => [ListItem], { name: 'listItem' })
  // findAll() {
  //   return this.listItemService.findAll();
  // }

  // @Query(() => ListItem, { name: 'listItem' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.listItemService.findOne(id);
  // }

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
