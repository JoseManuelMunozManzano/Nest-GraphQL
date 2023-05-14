// DTO - Data Transfer Object
import { IsNotEmpty, IsString } from 'class-validator';

// Estos objetos son utilizados para asegurarse que la información luce y es trasladada de un lugar a otro y tiene ese formato.
export class CreateTodoDto {
  // Las validaciones que debe cumplir el campo description que me envíen en el request.
  @IsString()
  @IsNotEmpty()
  description: string;
}
