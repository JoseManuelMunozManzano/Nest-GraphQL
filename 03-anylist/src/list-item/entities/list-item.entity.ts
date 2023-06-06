import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { List } from './../../lists/entities/list.entity';
import { Item } from './../../items/entities/item.entity';

@Entity('listItems')
// Indicamos la constraint
// https://wanago.io/2021/08/09/constraints-postgresql-typeorm/
// https://typeorm.io/decorator-reference#unique
@Unique('listItem-item', ['list', 'item'])
@ObjectType()
export class ListItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'numeric' })
  @Field(() => Number)
  quantity: number;

  @Column({ type: 'boolean' })
  @Field(() => Boolean)
  completed: boolean;

  // Relaciones

  // Muchos listItems pueden pertenecer a una lista.
  // Gracias a lazy a true en GraphQL podremos cargar esta relación.
  @ManyToOne(() => List, (list) => list.listItem, { lazy: true })
  @Field(() => List)
  list: List;

  // Muchas entradas de listItem se asocian a un único item.
  // Gracias a lazy a true en GraphQL podremos cargar esta relación.
  @ManyToOne(() => Item, (item) => item.listItem, { lazy: true })
  @Field(() => Item)
  item: Item;
}
