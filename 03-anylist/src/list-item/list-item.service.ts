import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { List } from './../lists/entities/list.entity';
import { ListItem } from './entities/list-item.entity';

import { PaginationArgs, SearchArgs } from './../common/dto/args';

import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { Repository } from 'typeorm';

@Injectable()
export class ListItemService {
  constructor(
    // Inyectamos el repositorio para poder hacer interacciones con la BD y TypeOrm
    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>,
  ) {}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    // El problema que tenemos aquí es que para crear una nueva instancia de un newListItem
    // podríamos verlo como una instancia de list y otra de item, pero no las tenemos en este
    // momento. Sabemos sus IDs.
    // Estamos diciendo que vamos a insertar esos objetos, pero NO son objetos.
    //
    // const newListItem = this.listItemsRepository.create(createListItemInput);
    //
    // Para solucionarlo:
    // Hay que indicar los campos y las relaciones para poder insertarlo específicamente por IDs.
    const { itemId, listId, ...rest } = createListItemInput;
    const newListItem = this.listItemsRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId },
    });

    return this.listItemsRepository.save(newListItem);
  }

  async findAll(
    list: List,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listItemsRepository
      .createQueryBuilder('listItem')
      .innerJoin('listItem.item', 'item')
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, { listId: list.id });

    if (search) {
      // Añadir item.name para hacer referencia a que el nombre está en el item.
      queryBuilder.andWhere('LOWER(item.name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = await this.listItemsRepository.findOneBy({ id });

    if (!listItem)
      throw new NotFoundException(`List item with id ${id} not found`);

    return listItem;
  }

  async update(
    id: string,
    updateListItemInput: UpdateListItemInput,
  ): Promise<ListItem> {
    const { listId, itemId, ...rest } = updateListItemInput;

    // Lo vamos a acabar haciendo con un QueryBuilder, pero esta es la otra forma de hacerlo, con preload,
    // menos flexible y que no acaba de funcionar del todo.
    //
    // No funciona del todo porque si lo que queremos actualizar es el id de la lista a la que pertenece
    // este listItem (su listId), veremos que no lo actualiza.
    //
    // Por eso, como se ha comentado, la solución es hacerlo con un QueryBuilder.
    //
    // const listItem = await this.listItemsRepository.preload({
    //   ...rest,
    //   list: { id: listId },
    //   item: { id: itemId },
    // });

    // if (!listItem)
    //   throw new NotFoundException(`List item with id ${id} not found`);

    // return this.listItemsRepository.save(listItem);

    const queryBuilder = this.listItemsRepository
      .createQueryBuilder()
      .update()
      .set(rest)
      .where('id = :id', { id });

    // Actualizando las relaciones.
    // Tenemos integridad referencial.
    if (listId) queryBuilder.set({ list: { id: listId } });
    if (itemId) queryBuilder.set({ item: { id: itemId } });

    // execute() NO devuelve una instancia de nuestro objeto.
    // Si devuelve un resultado indicando cuánta filas fueron insertadas...
    await queryBuilder.execute();

    // Por eso hacemos el findOne, que si regresa un objeto.
    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }

  // LISTAS

  async countListItemsByList(list: List): Promise<number> {
    return this.listItemsRepository.count({
      where: {
        list: {
          id: list.id,
        },
      },
    });
  }
}
