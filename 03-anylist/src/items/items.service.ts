import { Like, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateItemInput, CreateItemInput } from './dto/inputs';
import { PaginationArgs, SearchArgs } from './../common/dto/args';

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

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Item[]> {
    // Siempre van a tener valores por el lado de TypeScript.
    const { limit, offset } = paginationArgs;
    // Este valor puede venir nulo.
    const { search } = searchArgs;

    // Traemos todos los items del usuario.
    //
    // NOTA: Esto ya ha crecido mucho, y encima la búsqueda no acaba de funciona bien.
    // Se enseña como sería la búsqueda con esta estructura y luego lo haremos con un QueryBuilder.
    //
    //! Queda comentado para hacer la búsqueda con un Query Builder (comentado con //?)
    //? return await this.itemsRepository.find({
    // Este es el limit, los registros que va a traer.
    //? take: limit,
    // Este es el offset, los registros que se salta.
    //? skip: offset,
    // Habiendo indicado lazy a true en item.entity.ts esto ya no haría falta.
    //relations: { user: true },
    //? where: {
    //?   user: {
    //?     id: user.id,
    //?   },
    // Filtro de búsqueda con like.
    // Problema: Si busco rice no me encuentra Rice y si busco Rice no me encuentra rice, y no
    // tiene fácil solución. Además, si no mando ningún search el toLowerCase() hará que falle,
    // porque search será undefined (aquí TS debería advertirme algo porque search es opcional...)
    //?     name: Like(`%${search.toLowerCase()}%`),
    //?   },
    //? });

    // Query Builder
    const queryBuilder = this.itemsRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      // Se indica "userId" entre comillas dobles para especificar que quiero el campo userId de la tabla
      // y no el objeto usuario por la relación que tenemos con typeorm.
      // Luego, en el segundo parámetro, indico que la variable :userID que estoy inyectando apunta a user.id
      // Haciéndolo de esta forma typeorm evita SQLInyection, porque lo escapa.
      .where(`"userId" = :userId`, { userId: user.id });

    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }

    // Indico que quiero todo lo que ese queryBuilder retorne.
    return queryBuilder.getMany();
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
