import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateItemInput, CreateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {
  constructor(
    // Configurando el repositorio, inyectándolo en el Servicio.
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    // Creamos el item (la instancia) pero todavía no está salvado en BD.
    // Hay que hacerlo en dos pasos porque ahora, en newItem, podríamos querer cambiar algo.
    const newItem = this.itemsRepository.create(createItemInput);
    // Grabación en BD
    return await this.itemsRepository.save(newItem);
  }

  async findAll(): Promise<Item[]> {
    // TODO: filtrar, paginar, por usuario...
    // Por ahora trae todo
    return this.itemsRepository.find();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ id });

    if (!item) throw new NotFoundException(`Item with id: ${id} not found!`);

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    // Con preload busca por el id y carga toda la entidad con las modificaciones.
    // También se podría haber hecho buscando en nuestro método findOne.
    const item = await this.itemsRepository.preload(updateItemInput);

    if (!item) throw new NotFoundException(`Item with id: ${id} not found!`);

    // con save ya actualizamos realmente.
    return this.itemsRepository.save(item);
  }

  // Indicar que es mejor marcar como borrado que un borrado físico.
  async remove(id: string): Promise<Item> {
    // TODO: soft delete, integridad referencial
    const item = await this.findOne(id);
    await this.itemsRepository.remove(item);

    // Devolvemos así porque el id al hacer el remove se pierde. Da el siguiente error:
    // Cannot return null for non-nullable field item.id
    // Por tanto devolvemos el id que nos pasan en el body.
    return { ...item, id };
  }
}
