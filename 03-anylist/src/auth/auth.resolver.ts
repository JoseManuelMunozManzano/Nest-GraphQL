import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { SingupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

// Esta parte de autenticación/autorización solo va a trabajar con la parte de creación de usuarios.
// signup()
// Nuestro servicio auth.service.ts se va a comunicar con users.service.ts, que es el servicio
// que realmente creará el usuario.
// De nuevo en nuestro auth.service.ts generaremos un JWT token que vamos a regresar junto con el usuario creado.
//
// login()
// Dado un email y un password, devolveremos el token y el usuario.
//
// revalidate()
// Si el token ha expirado podemos devolver un token nuevo.
//
// Problema a resolver:
// Dependencia cíclica: Vamos a tener Guards y decoradores que nos servirán para proteger nuestras rutas.
//   Nuestro módulo de autenticación va a tener una dependencia con el módulo users, que a su vez, cuando queramos validar
//   queries como findAll() y findOne() vamos a ocupar una dependencia del módulo auth.
//   Es decir, el módulo auth depende del módulo users y el módulo users depende del módulo auth.
// Esto vamos a tener que pasarlo.
// Según la documentación de Nest hay que evitar hasta donde sea posible este tipo de dependencias cíclicas, pero
// aquí vamos a tener un caso donde es necesario hacerlo.
//
// Como todos nuestros Mutations devuelven un AuthResponse, es bueno indicarlo en nuestro @Resolver.
// Esto ayuda en GraphQL y en la documentación de Apollo, para los desarrolladores del front.
@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // En un mutation estamos esperando datos, tenemos que saber como luce esa información y por tanto
  // hablamos de dto, que en GraphQL son llamados input y que indicamos en el decorador @Args()
  // Nota: se ha creado la clase SignupInput
  //
  // La información que vamos a retornar, indicada en @Mutation y en la salida del método (para TS) serán los campos
  // que nos pueden solicitar desde el front. Para esto creamos un custom object type.
  // Nota: se ha creado la clase AuthResponse
  @Mutation(() => AuthResponse, { name: 'signup' })
  async signup(
    @Args('signupInput') signupInput: SingupInput,
  ): Promise<AuthResponse> {
    return this.authService.signup(signupInput);
  }

  // El login lo vamos a validar con JWT
  // El input de entrada ese llama LoginInput.
  // El valor de retorno es algo de tipo AuthResponse.
  @Mutation(() => AuthResponse, { name: 'login' })
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  // Revalidar el token
  // Queremos regresar nuestro AuthResponse (usuario y token)
  //
  // Para autenticación en RESTFul utilizábamos @UserGuards(AuthGuard()) pero esto no funciona aquí.
  // Vamos a crear nuestro propio AuthGuard basado en el que nos pasa la gente de passport.
  // Ver jwt-auth.guard.ts
  // Una vez hecho, si lanzamos en Apollo el revalidate obtendremos un 401 Unauthorized.
  // Esto es correcto, porque estamos pidiendo un JWT y no lo estamos facilitando.
  // En Apollo, al hacer la petición, ir a la pestaña Headers y, tras hacer un login, coger el token
  // y ponerlo en Set shared headers.
  // La key es Authorization y el value es la palabra Bearer seguido de un espacio y el token que nos
  // ha dado el login.
  // Tras volver a ejecutar el revalidate vuelve a dar un error Token not valid :( porque nos falta
  // confirmar quien es el usuario, si está activo y tiene permisos para entrar a ese recurso.
  // Nos falta, en jwt.strategy.ts, en el método validate, coger del payload el usuario y validarlo.
  //
  // Esto es lo único que ahora mismo requiere autenticación.
  // Luego haremos que toda la aplicación requiera autenticación.
  //
  // Para nuestro AuthResponse necesitamos saber el token (fácil porque con el id del usuario generaré un nuevo JWT)
  // Lo difícil es saber qué usuario es. Para obtener el usuario vamos a hacer un decorador llamado @CurrentUser
  //
  // Para autorización:
  // Nuestro decorador @CurrentUser puede enviar roles de usuario, que luego usará el mismo decorador para
  // validar que el usuario tiene ese rol. En este caso estamos mandando el rol admin (se creo el enumerado de roles posibles)
  // para indicar que solo el rol admin va a poder ejecutar el revalidateToken.
  // Si lo mandamos vacío signifca que cualquier persona puede entrar en revalidateToken.
  @Query(() => AuthResponse, { name: 'revalidate' })
  @UseGuards(JwtAuthGuard)
  revalidateToken(
    @CurrentUser(/* [ValidRoles.admin] */) user: User,
  ): AuthResponse {
    return this.authService.revalidateToken(user);
  }
}
