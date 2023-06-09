import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Item } from './../../items/entities/item.entity';
import { List } from './../../lists/entities/list.entity';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  fullName: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  // Como no vamos a querer hacer queries sobre el password, el decorador @Field de GraphQL no se va a colocar.
  //@Field(() => String)
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  @Field(() => [String])
  roles: string[];

  @Column({
    type: 'boolean',
    default: true,
  })
  @Field(() => Boolean)
  isActive: boolean;

  // La relación en este campo es la siguiente:
  // Muchos updates pueden estar hechos por una persona.
  // Esto es nuevo en el sentido de que no habíamos hecho en el curso de Nest con REST un @ManyToOne en la misma tabla.
  // nullable a true porque al principio está nula (no tiene sentido en el alta indicar este campo)
  //
  // Con @JoinColumn() indicamos que queremos que siempre se recupere el campo y el nombre del campo (si no por defecto
  // nos indica lastUpdateById)
  //
  // Esto es suficiente para TypeOrm, pero GrapthQL indicaremos que es un @Field y que es nullable.
  //
  // Para que se cargue la relación en el método findAll, en concreto cuando hay roles, se indica eager a true.
  // Esto funciona excepto en un QueryBuilder.
  // El problema es que la carga es de una sola vía, de una tabla a otra, NO en la misma tabla, como este caso.
  //
  // Por tanto, para que nos funcione en la misma tabla y además compatible con QueryBuilder, usaremos lazy a true.
  // https://orkhan.gitbook.io/typeorm/docs/eager-and-lazy-relations
  @ManyToOne(() => User, (user) => user.lastUpdateBy, {
    nullable: true,
    //eager: true,
    lazy: true,
  })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User;

  // En el lado de User, un usuario puede tener muchos items.
  // Se indica el campo con el que se va a establecer la relación (item.user en este caso)
  //
  // Parte typeorm
  // Lo de lazy a true no tiene mucho sentido porque generalmente no vamos a querer cargar
  // los items de los usuarios, pero para aprender, vamos a recuperarlos. Luego lo deshabilitaremos.
  //
  //
  //
  // PROBLEMA: Si quiero hacer esta query en GraphQL, paginando items dentro de users y con filtro de búsqueda:
  // {
  //   users {
  //     fullName
  //     items(limit: 5, offset: 0, search: "rice") {
  //       name
  //     }
  //   }
  // }
  // ahora mismo no funciona debido a la relación que tenemos.
  // Esto es porque este campo items está propiamente relacionado con nuestra BD.
  // Queremos romper la relación automática y definir la forma, como yo quiera, controlada,
  // como estos items se construyen, y no decirle a typeorm que se encargue de cargarlos.
  // Así nuestros queries van a ser muy flexibles.
  //
  // SOLUCION: Vamos a eliminar estos items del objeto de GraphQL.
  // La relación de aquí abajo la dejamos porque es correcta, pero NO queremos que GraphQL sepa que aquí
  // tenemos una relación directa y la construiremos nosotros con un Custom Resolver como hicimos en el método
  // itemCount(), en users.resolver.ts
  @OneToMany(() => Item, (item) => item.user, { lazy: true })
  // Parte GraphQL --> Comentado para que, como hemos dicho, GraphQL no conozca esta relación.
  // Ahora, para GraphQL, el objeto usuario NO tiene items, no los puedo consultar en una query.
  // Es lo mismo que hicimos un poco más arriba con el campo password (no tiene @Field)
  // @Field(() => [Item])
  items: Item[];

  // En esta entidad de Users, un usuario puede tener muchas listas.
  // No lo pongo como @Field porque no quiero que GraphQL conozca esta relación.
  // La voy a indicar yo para añadir filtros.
  @OneToMany(() => List, (list) => list.user)
  lists: List[];
}
