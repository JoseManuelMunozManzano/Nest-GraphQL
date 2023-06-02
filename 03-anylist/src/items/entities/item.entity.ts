import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './../../users/entities/user.entity';

// Pueden convivir perfectamente el decorador que indica que es una entidad con el decorador que indica que es un
// object type (para GraphQL)
@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  // Esto ya no lo necesito
  // @Column()
  // @Field(() => Float)
  // quantity: number;

  // Lo ponemos como que puede ir a nulos, a nivel TS, GraphQL y entidad.
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  quantityUnits?: string; // g, ml, kg, tsp

  // stores

  // user
  // A partir de ahora no voy a poder crear items si no se a que usuario le pertenecen.
  // Con el id del usuario podré hacer las queries.
  // En esta entity de Item, muchos items pertenecen a un usuario
  // Se indica el campo con el que se va a establecer la relación (user.items en este caso)
  //
  // Parte typeorm
  @ManyToOne(() => User, (user) => user.items)
  // Parte GraphQL
  @Field(() => User)
  user: User;
}
