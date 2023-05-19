// Se crea lo segundo de todo con el mandato CLI
//  nest g r todo --no-spec
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoInput } from './dto/inputs/create-todo.input';

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

  // Las mutaciones son queries usadas para modificar la data almacenada y retornar valores.
  // Los inputs son mutaciones, información que llamaríamos body en una petición REST tradicional.
  //
  // Por tanto, se usan @Query para consultas y @Mutation para mutar la data.
  @Mutation(() => Todo, { name: 'createTodo' })
  // Lo que indicamos entre paréntesis en @Args es lo que vamos a exponer al mundo exterior.
  createTodo(@Args('createTodoInput') createTodoInput: CreateTodoInput): Todo {
    return this.todoService.create(createTodoInput);
  }

  updateTodo() {}

  removeTodo() {}
}
