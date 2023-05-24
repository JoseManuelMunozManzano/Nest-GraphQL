// Creado con el mandato CLI
// nest g res items --no-spec
// Y seleccionando GraphQL (code first)
import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';

@Module({
  providers: [ItemsResolver, ItemsService],
})
export class ItemsModule {}
