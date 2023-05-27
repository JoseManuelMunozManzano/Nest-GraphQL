// Creado con el mandato CLI
//    nest g res users --no-spec
// Con GraphQL (code first)
// Antes del commit se ha tocado bastante para que luzca como queremos.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './entities/user.entity';

@Module({
  providers: [UsersResolver, UsersService],
  // Para que la entidad se cree automáticamente y se pueda ver en TablePlus, SquirrelSQL...
  imports: [TypeOrmModule.forFeature([User])],
  exports: [
    // Para que otro módulo pueda inyectar userRepository, pero por ahora lo dejamos comentado.
    // TypeOrmModule,
    UsersService,
  ],
})
export class UsersModule {}
