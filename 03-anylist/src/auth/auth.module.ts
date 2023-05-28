// Creado con el mandato CLI
//    nest g res auth --no-spec
// Y GraphQL code first.
// En este caso no generamos el CRUD completo
//
// Para la autenticación vamos a instalar passport:
//   https://docs.nestjs.com/recipes/passport
//   yarn add @nestjs/passport passport
// La estrategia que vamos a usar es JWT e instalaremos:
//   https://docs.nestjs.com/recipes/passport#jwt-functionality
//   yarn add @nestjs/jwt passport-jwt
// Y los tipos para TypeScript
//   yarn add -D @types/passport-jwt
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

import { UsersModule } from './../users/users.module';

@Module({
  providers: [AuthResolver, AuthService],
  // Para poder usar UsersService importamos su módulo.
  imports: [
    // Configuración del módulo principal (passport) para especificar como queremos que se validen nuestros JWT
    // y vamos a crear las estrategias.
    //
    // Configuración de nuestras variables de entorno.
    ConfigModule,
    // Configuración de PassportModule para autenticación, indicando la estrategia jwt
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Configuración de nuestro módulo de JWT de manera asíncrona para asegurarnos de que tenemos
    // cargadas y leidas nuestras variables de entorno.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // Definiendo de manera asíncrona la creación del módulo JwtModule.
      // Indicamos entre paréntesis la inyección de dependencias como si estuviéramos en un servicio.
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '2d' },
      }),
    }),

    UsersModule,
  ],
})
export class AuthModule {}
