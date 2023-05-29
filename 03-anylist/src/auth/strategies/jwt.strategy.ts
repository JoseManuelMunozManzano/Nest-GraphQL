// Vamos a definir la estrategia JWT.
// Crearemos un archivo por cada estrategia.
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

import { User } from '../../users/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-interface';
import { AuthService } from '../auth.service';

// Cuando se utilice esta estrategia buscará una función de validación para poder recibir la información
// que esperamos y realizar el proceso de verificación del payload (nuestro JWT Token)
//
// Como se va a inyectar utilizamos el decorador @Injectable.
// Con esto sería un Provider (y un servicio) y lo indicaremos en auth.modules.ts en providers.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      // Cual es la llave que vamos a usar para trabajar con los tokens (leer, desencriptar, encriptar...)
      secretOrKey: configService.get('JWT_SECRET'),
      // Dónde va a venir el token, en este caso en la parte de los header como un bearer token.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // Validar la información. El método TIENE QUE LLAMARSE validate()
  async validate(payload: JwtPayload): Promise<User> {
    // console.log({ payload });

    // Nos falta validar el usuario y si todo va bien lo que se retorne se añade a la request.
    // El id debe existir y el usuario debe estar activo.
    const { id } = payload;
    // Hay excepciones en validateUser.
    const user = await this.authService.validateUser(id);

    return user;
  }
}
