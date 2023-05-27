import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SingupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';

// Esta parte de autenticación/autorización solo va a trabajar con la parte de creación de usuarios.
// signup()
// Nuestro servicio auth.service.ts se va a comunicar con users.service.ts, que es el servicio
// que realmente creará el usuario.
// De nuevo en nuestro auth.service.ts generaremos un JWT token que vamos a regresar junto con el usuario creado.
//
// login()
// Dado un email y un password, devolveremos el token.
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
@Resolver()
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
  // @Mutation(/** ???? */, {name: 'login'})
  // async login(/** logininput */):Promise</** ???? */> {
  //   return this.authService.login(/** ??? */);
  // }

  // Revalidar el token
  // @Query(/**??? */, {name: 'revalidate'})
  // async revalidateToken() {
  //   return this.authService.revalidateToken(/** ??? */)
  // }
}
