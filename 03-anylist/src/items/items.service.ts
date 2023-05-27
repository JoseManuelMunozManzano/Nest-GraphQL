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

  update(id: number, updateItemInput: UpdateItemInput) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
