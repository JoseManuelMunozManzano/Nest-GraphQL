import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { ValidRoles } from '../enums/valid-roles.enum';
import { User } from '../../users/entities/user.entity';

// createParamDecorator es una función factory que llama al callback definido en el.
// La forma de hacer el decorador es un poco distinta a como lo hacíamos en un RESTFul tradicional.
// Aquí tenemos que pasarlo por la creación del ExecutionContext de GraphQL porque en GraphQL la ejecución
// es algo diferente.
//
// Autorización. Tenemos que saber que roles tiene cada usuario para ver a qué tiene autorización.
// Creamos un enumerado ValidRoles
export const CurrentUser = createParamDecorator(
  (roles: ValidRoles[] = [], context: ExecutionContext) => {
    // Obtengo el contexto
    const ctx = GqlExecutionContext.create(context);
    // Del contexto obtengo el request.
    // Este req.user podría venir nulo si no hemos pasado por el guard.
    const user: User = ctx.getContext().req.user;

    if (!user) {
      // Es un internal error porque es un error mío, pero se sigue viendo desde el frontend.
      throw new InternalServerErrorException(
        `No user inside the request - make sure that we used the AuthGuard`,
      );
    }

    // Si no se ha mandado ningún role significa que está abierto para todo el mundo.
    if (roles.length === 0) return user;

    // Se mira que el usuario disponga del rol mandado.
    for (const role of user.roles) {
      // TODO: Eliminar el casteo Valid Roles
      if (roles.includes(role as ValidRoles)) {
        return user;
      }
    }

    // Usuario autenticado pero sin la autorización (rol) para hacer lo que demanda.
    throw new ForbiddenException(
      `User ${user.fullName} need a valid role [${roles}]`,
    );
  },
);
