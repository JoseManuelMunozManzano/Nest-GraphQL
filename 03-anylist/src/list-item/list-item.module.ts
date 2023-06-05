// Creado con el mandato CLI
//    nest g res listItem --no-spec
// Con GraphQL (code first) y generate CRUD a Y
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListItem } from './entities/list-item.entity';

import { ListItemService } from './list-item.service';
import { ListItemResolver } from './list-item.resolver';

@Module({
  providers: [ListItemResolver, ListItemService],
  imports: [TypeOrmModule.forFeature([ListItem])],
  exports: [ListItemService, TypeOrmModule],
})
export class ListItemModule {}
