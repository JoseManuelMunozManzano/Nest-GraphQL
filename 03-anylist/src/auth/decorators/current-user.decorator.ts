import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// createParamDecorator es una función factory que llama al callback definido en el.
// La forma de hacer el decorador es un poco distinta a como lo hacíamos en un RESTFul tradicional.
// Aquí tenemos que pasarlo por la creación del ExecutionContext de GraphQL porque en GraphQL la ejecución
// es algo diferente.
export const CurrentUser = createParamDecorator(
  (roles = [], context: ExecutionContext) => {
    // Obtengo el contexto
    const ctx = GqlExecutionContext.create(context);
    // Del contexto obtengo el request.
    // Este req.user podría venir nulo si no hemos pasado por el guard.
    const user = ctx.getContext().req.user;

    if (!user) {
      // Es un internal error porque es un error mío, pero se sigue viendo desde el frontend.
      throw new InternalServerErrorException(
        `No user inside the request - make sure that we used the AuthGuard`,
      );
    }

    return user;
  },
);
