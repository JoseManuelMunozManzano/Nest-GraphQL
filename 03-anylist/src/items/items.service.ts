import { Injectable } from '@nestjs/common';
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

  findAll() {
    return `This action returns all items`;
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemInput: UpdateItemInput) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
