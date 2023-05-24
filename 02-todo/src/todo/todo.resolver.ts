// Se crea lo segundo de todo con el mandato CLI
//  nest g r todo --no-spec
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoInput, UpdateTodoInput, StatusArgs } from './dto';
import { AggregationsType } from './types/aggregations.type';

// Indicamos, para que no sea tan genérico, que nuestro resolver va a trabajar con un Todo.
// Es buena práctica.
@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  // Para indicar que se regresa un array de Todo, se indica [Todo]
  @Query(() => [Todo], { name: 'todos' })
  findAll(@Args() statusArgs: StatusArgs): Todo[] {
    return this.todoService.findAll(statusArgs);
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

  // El id del todo que se va a actualizar viene en el Body, no como url. Ver updateTodoInput.
  @Mutation(() => Todo, { name: 'updateTodo' })
  // Dentro de @Args, el updateTodoInput, es lo que el frontend me tiene que enviar.
  updateTodo(@Args('updateTodoInput') updateTodoInput: UpdateTodoInput): Todo {
    // Es muy típico también mandar el id por separado
    return this.todoService.update(updateTodoInput.id, updateTodoInput);
  }

  @Mutation(() => Boolean)
  removeTodo(@Args('id', { type: () => Int }) id: number): boolean {
    return this.todoService.delete(id);
  }

  // Aggregation
  // Se van a indicar la cantidad de todos que tenemos, los completados y los pendientes
  // Hay varias formas de hacer esto.
  // Esta es la más sencilla, con tres queries nuevos.
  @Query(() => Int, { name: 'totalTodos' })
  totalTodos() {
    return this.todoService.totalTodos;
  }

  @Query(() => Int, { name: 'completedTodos' })
  completedTodos() {
    return this.todoService.completedTodos;
  }

  @Query(() => Int, { name: 'pendingTodos' })
  pendingTodos() {
    return this.todoService.pendingTodos;
  }

  // La otra forma de realizar Aggregation es usando ObjectTypes.
  // Así las tendremos en su propio nivel y vendrán los 3 datos agrupados.
  // Ver aggregations.type.ts
  // Indicar que es casi preferible la opción anterior por su flexibilidad, pero esta forma también es muy útil.
  @Query(() => AggregationsType, { name: 'aggregations' })
  aggregations(): AggregationsType {
    return {
      completed: this.todoService.completedTodos,
      pending: this.todoService.pendingTodos,
      total: this.todoService.totalTodos,
      totalTodosCompleted: this.todoService.total,
    };
  }
}
