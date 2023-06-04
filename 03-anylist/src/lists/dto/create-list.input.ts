import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateListInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  name: string;
}
