import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HelloWorldModule } from './hello-world/hello-world.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    // Para la instalación de paquetes y configuración de GraphQL en Nest, seguir la documentación siguiente:
    // https://docs.nestjs.com/graphql/quick-start
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // Este esquema se creará automáticamente.
      // Pero falta proveer el query inicial, el entry point y la consulta mínima que necesita GraphQL.
      //
      // NOTA: Una vez definido el Resolver hello-world.resolver.ts, se creó automáticamente el fichero schema.gpl
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // playground sirve para indicar la definición del esquema, para que los del frontend sepan como funciona.
      // Como vamos a trabajar con Apollo desactivamos playground.
      playground: false,
      // Para trabajar con Apollo
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    HelloWorldModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
