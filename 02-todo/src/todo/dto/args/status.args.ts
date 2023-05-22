import { ArgsType, Field } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';

// Nota: Los args son los argumentos que queremos recibir.
@ArgsType()
export class StatusArgs {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
