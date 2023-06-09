import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';

import { ListsService } from './lists.service';
import { ListItemService } from './../list-item/list-item.service';

import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';

import { CurrentUser } from './../auth/decorators/current-user.decorator';

import { List } from './entities/list.entity';
import { ListItem } from './../list-item/entities/list-item.entity';
import { User } from './../users/entities/user.entity';

import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { PaginationArgs, SearchArgs } from './../common/dto/args';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listItemsService: ListItemService,
  ) {}

  @Mutation(() => List, { name: 'createList' })
  async createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<List[]> {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => List, { name: 'list' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List, { name: 'updateList' })
  async updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List, { name: 'removeList' })
  async removeList(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<List> {
    return this.listsService.remove(id, user);
  }

  @ResolveField(() => [ListItem], { name: 'items' })
  async getListitems(
    // Sabemos la lista que es porque tenemos el padre
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    // Se ha inyectado ListItemService para usar su método findAll() y obtener todos los items.
    return this.listItemsService.findAll(list, paginationArgs, searchArgs);
  }

  @ResolveField(() => Int, { name: 'totalItems' })
  async countListItemsByList(@Parent() list: List): Promise<number> {
    return this.listItemsService.countListItemsByList(list);
  }
}
