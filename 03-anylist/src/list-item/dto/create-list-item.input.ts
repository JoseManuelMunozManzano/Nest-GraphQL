import { InputType, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {
  // Como siempre, especificamos las validaciones:
  // a nivel de GraphQL
  // a nivel de class-validator
  // a nivel de TypeScript
  @Field(() => Number, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity = 0;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  completed = false;

  @Field(() => ID)
  @IsUUID()
  listId: string;

  @Field(() => ID)
  @IsUUID()
  itemId: string;
}
