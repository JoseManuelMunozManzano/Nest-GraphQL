import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';

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

  @Mutation(/** ???? */, {name: 'signup'})
  async signup(/** signupinput */):Promise</** ???? */> {
    return this.authService.signup(/** ??? */);
  }

  // El login lo vamos a validar con JWT
  @Mutation(/** ???? */, {name: 'login'})
  async login(/** logininput */):Promise</** ???? */> {
    return this.authService.login(/** ??? */);
  }

  // Revalidar el token
  @Query(/**??? */, {name: 'revalidate'})
  async revalidateToken() {
    return this.authService.revalidateToken(/** ??? */)
  }

}
