// Se crea lo segundo de todo con el mandato CLI
//  nest g r todo --no-spec
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
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

  @Query(() => Todo, { name: 'todo' })
  findOne(@Args('id', { type: () => Int }) id: number): Todo {
    return this.todoService.findOne(id);
  }

  createTodo() {}

  updateTodo() {}

  removeTodo() {}
}
