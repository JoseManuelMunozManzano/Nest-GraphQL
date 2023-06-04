import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';

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

    // Vamos a bloquear el schema si el usuario no está autenticado (no hay token)
    // Indicar que esto sólo tiene sentido si el login y el signup están en RESTFul porque si no,
    // si tenemos bloqueado el schema, ¿cómo nos logueamos?
    //
    // La idea es bloquear GraphQLModule y para eso hay que transformarlo en un módulo asíncrono con
    // su factory, y que el módulo JWTModule, que está en AuthModule, esté activo para poder obtener
    // el JWT Token y poder validarlo.
    //
    // Un módulo asíncrono tiene sentido cuando tenemos alguna configuración que dependa de algún endpoint.
    //
    // Para probar esto, en Apollo quitar el check en los Headers, en la key Authorization
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [AuthModule],
      // Permitiendo la inyección
      inject: [JwtService],
      // Inyectando
      useFactory: async (jwtService: JwtService) => ({
        playground: false,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        // Como ver la información que trae nuestro schema y trabajar con ella.
        context({ req }) {
          // NOTA: Esto es para saber como se hace, pero tenemos que comentarlo porque si no no podremos hacer el
          // login una vez expire.
          //
          // Cogemos el token del header (si viene, de ahí la ?) y con nuestros módulos de autorización vemos si es válido.
          // const token = req.headers.authorization?.replace('Bearer ', '');
          // if (!token) throw Error('Token needed');
          // const payload = jwtService.decode(token);
          // if (!payload) throw Error('Token not valid');
          //console.log({ payload });
        },
      }),
    }),

    //? Esta es la configuración básica de GraphModule
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   playground: false,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   plugins: [ApolloServerPluginLandingPageLocalDefault()],
    // }),

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

    SeedModule,

    CommonModule,

    ListsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
