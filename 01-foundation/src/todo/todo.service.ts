import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

// Un servicio maneja la lógica de negocio de nuestra aplicación.
@Injectable()
export class TodoService {
  // Para este reforzamiento de Nest NO se va a usar bases de datos.
  private todos: Todo[] = [
    { id: 1, description: 'Piedra del Alma', done: false },
    { id: 2, description: 'Piedra del Tiempo', done: false },
    { id: 3, description: 'Piedra del Espacio', done: true },
  ];

  create(createTodoDto: CreateTodoDto): Todo {
    const todo = new Todo();
    todo.id = Math.max(...this.todos.map((todo) => todo.id), 0) + 1;
    todo.description = createTodoDto.description;

    this.todos.push(todo);

    return todo;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find((todo) => todo.id === id);

    if (!todo) throw new NotFoundException(`TODO with #${id} not found`);

    return todo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto): Todo {
    const { done, description } = updateTodoDto;

    const todo = this.findOne(id);

    if (done !== undefined) todo.done = done;
    if (description) todo.description = description;

    this.todos = this.todos.map((dbTodo) => {
      if (dbTodo.id === id) return todo;

      return dbTodo;
    });

    return todo;
  }

  remove(id: number): void {
    // Ni se pasa a variable porque si no existe devuelve la excepción y no continua.
    this.findOne(id);

    this.todos = this.todos.filter((todo) => todo.id !== id);
  }
}
