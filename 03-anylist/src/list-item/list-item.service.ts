import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ListItem } from './entities/list-item.entity';

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

  async findAll(): Promise<ListItem[]> {
    return this.listItemsRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} listItem`;
  }

  update(id: number, updateListItemInput: UpdateListItemInput) {
    return `This action updates a #${id} listItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
