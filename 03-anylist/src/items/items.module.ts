// Creado con el mandato CLI
// nest g res items --no-spec
// Y seleccionando GraphQL (code first)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemsResolver } from './items.resolver';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';

@Module({
  providers: [ItemsResolver, ItemsService],
  // Se indica forFeature porque solo puede haber un forRoot por aplicación, especificado en app.module,
  // y luego en un arreglo las entidades que va a tener este módulo
  imports: [TypeOrmModule.forFeature([Item])],
})
export class ItemsModule {}
