// Creado con el mandato CLI
//    nest g res auth --no-spec
// Y GraphQL code first.
// En este caso no generamos el CRUD completo
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

import { UsersModule } from './../users/users.module';

@Module({
  providers: [AuthResolver, AuthService],
  // Para poder usar UsersService importamos su módulo.
  imports: [UsersModule],
})
export class AuthModule {}
