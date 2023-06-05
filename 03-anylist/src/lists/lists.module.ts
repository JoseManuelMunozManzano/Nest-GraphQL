// Creado con el mandato CLI
//    nest g res lists --no-spec
// Con GraphQL (code first) y generate CRUD a y
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';

import { ListItemModule } from './../list-item/list-item.module';

import { List } from './entities/list.entity';

@Module({
  providers: [ListsResolver, ListsService],
  imports: [TypeOrmModule.forFeature([List]), ListItemModule],
  exports: [ListsService, TypeOrmModule],
})
export class ListsModule {}
