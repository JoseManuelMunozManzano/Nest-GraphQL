import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ItemsModule } from './items/items.module';

// Indicar que se pueden mezclar controladores con GraphQL.
// Se puede tener un controlador (un endpoint) que sea /graphql y dentro tener todas nuestras queries y mutations.
// Se puede hacer con el login por ejemplo.
// Como siempre, todo dependiendo de las necesidades del proyecto.
@Module({
  // Recordar que todo lo que sea Module irá en imports.
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    ItemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
