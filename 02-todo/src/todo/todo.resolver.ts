// Se crea lo segundo de todo con el mandato CLI
//  nest g r todo --no-spec
import { Query, Resolver } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';

@Resolver()
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  // Para indicar que se regresa un array de Todo, se indica [Todo]
  @Query(() => [Todo], { name: 'todos' })
  findAll(): Todo[] {
    return this.todoService.findAll();
  }

  findOne() {
    return [];
  }

  createTodo() {}

  updateTodo() {}

  removeTodo() {}
}
