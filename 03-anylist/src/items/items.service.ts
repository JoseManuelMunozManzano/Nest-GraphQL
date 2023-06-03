import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateItemInput, CreateItemInput } from './dto/inputs';
import { PaginationArgs } from './../common/dto/args/pagination.args';

import { Item } from './entities/item.entity';
import { User } from './../users/entities/user.entity';

@Injectable()
export class ItemsService {
  constructor(
    // Configurando el repositorio, inyectándolo en el Servicio.
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    // Creamos el item (la instancia) pero todavía no está salvado en BD.
    // Hay que hacerlo en dos pasos porque ahora, en newItem, podríamos querer cambiar algo.
    //
    // La mejor forma de añadir el usuario es con desestructuración.
    const newItem = this.itemsRepository.create({
      ...createItemInput,
      user,
    });
    // Grabación en BD
    return await this.itemsRepository.save(newItem);
  }

  async findAll(user: User, paginationArgs: PaginationArgs): Promise<Item[]> {
    // Siempre van a tener valores por el lado de TypeScript.
    const { limit, offset } = paginationArgs;

    // TODO: filtrar
    // Traemos todos los items del usuario
    return await this.itemsRepository.find({
      // Este es el limit, los registros que va a traer.
      take: limit,
      // Este es el offset, los registros que se salta.
      skip: offset,
      // Habiendo indicado lazy a true en item.entity.ts esto ya no haría falta.
      //relations: { user: true },
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({
      id,
      user: {
        id: user.id,
      },
    });

    if (!item) throw new NotFoundException(`Item with id: ${id} not found!`);

    // Para traer el user en la query en GraphQL.
    // Forma sencilla, rápida, pero fea
    //
    // item.user = user;
    //
    // La otra forma es indicar lazy a true en item.entity.ts

    return item;
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    // Hay que hacer 2 consultas a la BD.
    await this.findOne(id, user);

    // Con preload busca por el id y carga toda la entidad con las modificaciones.
    // También se podría haber hecho buscando en nuestro método findOne.
    //
    // Sin hacer el lazy en user, se podría precargar el usuario de la siguiente forma:
    // const item = await this.itemsRepository.preload({...updateItemInput, user});
    const item = await this.itemsRepository.preload(updateItemInput);

    if (!item) throw new NotFoundException(`Item with id: ${id} not found!`);

    // con save ya actualizamos realmente.
    return this.itemsRepository.save(item);
  }

  // Indicar que es mejor marcar como borrado que un borrado físico.
  async remove(id: string, user: User): Promise<Item> {
    // TODO: soft delete, integridad referencial
    const item = await this.findOne(id, user);
    await this.itemsRepository.remove(item);

    // Devolvemos así porque el id al hacer el remove se pierde. Da el siguiente error:
    // Cannot return null for non-nullable field item.id
    // Por tanto devolvemos el id que nos pasan en el body.
    return { ...item, id };
  }

  async itemCountByUser(user: User): Promise<number> {
    return this.itemsRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
