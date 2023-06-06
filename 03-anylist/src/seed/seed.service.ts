import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SEED_ITEMS, SEED_LIST, SEED_USERS } from './data/seed-data';

import { Item } from './../items/entities/item.entity';
import { List } from './../lists/entities/list.entity';
import { ListItem } from './../list-item/entities/list-item.entity';
import { User } from './../users/entities/user.entity';

import { ItemsService } from './../items/items.service';
import { ListsService } from './../lists/lists.service';
import { ListItemService } from './../list-item/list-item.service';
import { UsersService } from './../users/users.service';

@Injectable()
export class SeedService {
  private isProd: boolean;

  // Protección del SEED.
  //
  // El SEED solo puede ejecutarse en desarrollo.
  // Hay muchas formas de hacer esto.
  //
  // Como el login está en GraphQL, en vez de en REST, no puede protegerse el seed para que solo
  // pueda ejecutarlo un administrador (en headers con Authorization marcado y su token) porque la
  // primera vez NO hay ningún usuario en BD, queremos crearlos, pero va a pedir la autenticación.
  //
  // Lo que vamos a hacer para protegerlo es que en el fichero de variables de entorno (.env) tenemos
  // la variable STATE=dev
  // En producción el valor será STATE=prod
  // Es decir, si vale dev podremos ejecutar el SEED y si vale prod NO podremos ejecutarlo.
  //
  // Para poder usar las variables de entorno recordar que hay que inyectar el ConfigModule
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>,
    @InjectRepository(List)
    private readonly listsRepository: Repository<List>,

    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
    private readonly listItemsService: ListItemService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd) {
      throw new UnauthorizedException('We cannot run SEED in Production');
    }

    // Limpiar la BD - BORRAR TODO
    await this.deleteDatabase();

    // Crear usuarios
    const user = await this.loadUsers();

    // Crear items
    await this.loadItems(user);

    // Crear listas
    const list = await this.loadLists(user);

    // Crear listItems
    const items = await this.itemsService.findAll(
      user,
      { limit: 15, offset: 0 },
      {},
    );
    await this.loadListItems(list, items);

    return true;
  }

  async deleteDatabase() {
    // Borrar ListItems
    await this.listItemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // Borrar List
    await this.listsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // Borrar items
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // Borrar usuarios
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User> {
    const users = [];

    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }

    // Devuelvo el primer usuario porque los items pertenecerán a este usuario.
    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    const itemsPromises = [];

    // Creo un arreglo de promesas
    for (const item of SEED_ITEMS) {
      itemsPromises.push(this.itemsService.create(item, user));
    }

    // Ejecutar todas las promesas
    await Promise.all(itemsPromises);
  }

  async loadLists(user: User): Promise<List> {
    const lists = [];

    for (const list of SEED_LIST) {
      lists.push(await this.listsService.create(list, user));
    }

    return lists[0];
  }

  async loadListItems(list: List, items: Item[]): Promise<void> {
    for (const item of items) {
      this.listItemsService.create({
        quantity: Math.round(Math.random() * 10),
        completed: Math.round(Math.random() * 1) === 0 ? false : true,
        listId: list.id,
        itemId: item.id,
      });
    }
  }
}
