// Creado lo primero de todo con el mandato CLI:
// nest g mo todo
import { Module } from '@nestjs/common';
import { TodoResolver } from './todo.resolver';

@Module({
  providers: [TodoResolver]
})
export class TodoModule {}
