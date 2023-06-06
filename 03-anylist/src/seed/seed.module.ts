// Borra y Graba datos de prueba en la BD
// Creado con el mandato CLI:
//    nest g res seed --no-spec
// Con GraphQL (code first) y generate CRUD a no
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ItemsModule } from './../items/items.module';
import { ListsModule } from './../lists/lists.module';
import { ListItemModule } from './../list-item/list-item.module';
import { UsersModule } from './../users/users.module';

import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [
    ConfigModule,
    ItemsModule,
    ListItemModule,
    ListsModule,
    UsersModule,
  ],
})
export class SeedModule {}
