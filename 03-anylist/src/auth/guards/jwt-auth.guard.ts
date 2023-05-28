import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

// De todos los sabores que nos proporciona AuthGuard para validar, escogemos jwt.
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Hace falta hacer un override para hacerlo sobre el contexto de GraphQL y porque estamos alcanzando el mismo endpoint.
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request;
  }
}
