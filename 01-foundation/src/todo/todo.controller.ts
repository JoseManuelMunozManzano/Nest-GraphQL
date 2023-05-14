import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

// El controlador escucha solicitudes y emite respuestas.
@Controller('todo')
export class TodoController {
  constructor(
    // Inyección de dependencia.
    // Es buena práctica poner el readonly.
    private readonly todoService: TodoService,
  ) {}

  @Post()
  // El @Body de la request debe tener una data como la definida en el DTO.
  create(@Body() createTodoDto: CreateTodoDto): Todo {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  findAll(): Todo[] {
    return this.todoService.findAll();
  }

  @Get(':id')
  // Usando Pipes transformamos la data del request. En este ejemplo, transformamos de string a number.
  findOne(@Param('id', ParseIntPipe) id: number): Todo {
    return this.todoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
