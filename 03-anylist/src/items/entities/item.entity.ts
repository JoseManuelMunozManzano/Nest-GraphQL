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
  // Se indica que no puede ser nulo el usuario, es decir, el item tiene que pertenecer si o si a un user.
  // Esto es un constraint (una regla)
  // Para temas de rendimiento (si hay millones de usuarios por ejemplo) se añade un índice.
  // https://orkhan.gitbook.io/typeorm/docs/indices
  //
  // Eager Loading
  // El patrón de diseño Eager Loading consiste en la asociación de modelos relacionados para un determinado conjunto de
  // resultados con solo la ejecución de una consulta, en lugar de tener que ejecutar N consultas, donde N es el número de
  // elementos en el conjunto inicial.
  //
  // ¿Cuando debemos usar Eager Loading?
  //
  // -En «un lado» de las relaciones de uno a muchos y si estás seguro que se usará en todas partes con la entidad principal. Por
  // ejemplo, el usuario de un artículo o la categoría de un producto.
  //
  // -Cuando las relaciones no son demasiadas, ya que es una buena práctica utilizar Eager Loading para reducir las consultas en
  // el servidor.
  //
  // Lazy Loading
  //
  // El patrón de diseño Lazy Loading consiste en retrasar la carga o inicialización de un objeto hasta el mismo momento de su
  // requerimiento. Esto contribuye a la eficiencia de los programas, evitando la precarga de datos que podrían no llegar a
  // utilizarse.
  //
  // ¿Cuando debemos usar Lazy Loading?
  //
  // -Frecuentemente es usado en el «lado de la colección» de las relaciones de uno a muchos, como artículos de un usuario o
  //productos de una categoría.
  //
  // -Cuando sabes exactamente que no necesitarás una propiedad al instante, con esta acción evitas una consulta más larga y solo
  // solicitas los datos de la relación cuando sean necesarios.
  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('userId-index')
  // Parte GraphQL
  @Field(() => User)
  user: User;

  // Un item puede estar en varios listItems
  @OneToMany(() => ListItem, (listItem) => listItem.item, { lazy: true })
  @Field(() => [ListItem])
  listItem: ListItem[];
}
