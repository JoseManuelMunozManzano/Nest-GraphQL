// Creado con el mandato CLI
// nest g res todo --no-spec
import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';

// Un módulo es un agrupador.
// To-do lo que tenga que ver con todos va a estar enlazado a este módulo.
@Module({
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
