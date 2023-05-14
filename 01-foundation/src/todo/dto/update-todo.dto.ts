import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { IsBoolean, IsOptional } from 'class-validator';

// PartialType sirve para poder usar todas las propiedades de CreateTodoDto, pero en este caso serán optativas.
// Por supuesto, UpdatoTodoDto puede tener además sus propias propiedades.
export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @IsBoolean()
  @IsOptional()
  done?: boolean;
}
