import { Field, InputType, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

// Datos que esperamos para actualizar un Todo.
// Son los mismos datos que para crearlo, pero suelen ser opcionales.
@InputType()
export class UpdateTodoInput {
  // El id SI es obligatorio.
  @Field(() => Int)
  @IsInt()
  @Min(1)
  id: number;

  // Tal y como está GraphQL sabe que puede venir nulo, pero nuestro class-validator lo va a exigir.
  // Para que nuestro class-validator lo vea como opcional hay que indicar @IsOptional()
  @Field(() => String, { description: 'What needs to be done', nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @IsOptional()
  @Transform(({ value }) => value.trim())
  description?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  done?: boolean;
}
