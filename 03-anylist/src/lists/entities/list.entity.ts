import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './../../users/entities/user.entity';
import { ListItem } from './../../list-item/entities/list-item.entity';

@Entity({ name: 'lists' })
@ObjectType()
export class List {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  // En esta entidad de Lists, muchas listas pertenecen a un usuario.
  @ManyToOne(() => User, (user) => user.lists, { nullable: false, lazy: true })
  @Index('userId-list-index')
  @Field(() => User)
  user: User;

  // Una lista puede tener muchos listItem
  @OneToMany(() => ListItem, (listItem) => listItem.list, { lazy: true })
  @Field(() => [ListItem])
  listItem: ListItem[];
}
