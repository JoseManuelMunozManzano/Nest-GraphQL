import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

// Indicar que se pueden mezclar controladores con GraphQL.
// Se puede tener un controlador (un endpoint) que sea /graphql y dentro tener todas nuestras queries y mutations.
// Se puede hacer con el login por ejemplo.
// Como siempre, todo dependiendo de las necesidades del proyecto.
@Module({
  // Recordar que todo lo que sea Module irá en imports.
  imports: [
    // Para poder leer las variables de entorno hay que instalar:
    // yarn add @nestjs/config
    // Y añadir esta configuración.
    ConfigModule.forRoot(),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),

    // Para la integración de Nest con TypeOrm mirar: https://docs.nestjs.com/techniques/database
    // Hay que instalar:
    // yarn add @nestjs/typeorm typeorm pg
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DB_NAME,
      // Con synchronize al guardar automáticamente se crean las tablas de bases de datos.
      // IMPORTANTE: En producción synchronize: false
      synchronize: true,
      autoLoadEntities: true,
    }),

    ItemsModule,

    UsersModule,

    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
