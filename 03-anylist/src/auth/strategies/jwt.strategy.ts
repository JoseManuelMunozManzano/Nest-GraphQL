// Vamos a definir la estrategia JWT.
// Crearemos un archivo por cada estrategia.
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

import { User } from '../../users/entities/user.entity';

// Cuando se utilice esta estrategia buscará una función de validación para poder recibir la información
// que esperamos y realizar el proceso de verificación del payload (nuestro JWT Token)
//
// Como se va a inyectar utilizamos el decorador @Injectable.
// Con esto sería un Provider (y un servicio) y lo indicaremos en auth.modules.ts en providers.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // Cual es la llave que vamos a usar para trabajar con los tokens (leer, desencriptar, encriptar...)
      secretOrKey: configService.get('JWT_SECRET'),
      // Dónde va a venir el token, en este caso en la parte de los header como un bearer token.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // Validar la información. El método TIENE QUE LLAMARSE validate()
  async validate(payload: any): Promise<User> {
    console.log({ payload });

    throw new UnauthorizedException('Token not valid :(');
  }
}
