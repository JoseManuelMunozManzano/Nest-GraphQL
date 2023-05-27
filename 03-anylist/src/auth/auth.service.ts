import { BadRequestException, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { SingupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from './../users/users.service';

@Injectable()
export class AuthService {
  // Inyectando UsersService (se ha exportado en users.module.ts e importado en auth.module.ts)
  // para poder hacer uso del mismo.
  constructor(private readonly usersService: UsersService) {}

  async signup(signupInput: SingupInput): Promise<AuthResponse> {
    // La creación de los usuarios la vamos a delegar al servicio de los usuarios.
    const user = await this.usersService.create(signupInput);

    // Todo: crear JWT
    const token = 'ABC123';

    return {
      token,
      user,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;
    // AuthService no es el lugar adecuado para conectarse a la BD y traerse información del usuario.
    // El lugar ideal es nuestro UsersService.
    // Aquí validamos que el correo electrónico que se envió existe en la BD.
    const user = await this.usersService.findOneByEmail(email);

    // Validamos que la contraseña que se envía es la misma que la recuperada del usuario.
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Email/Password do not match');
    }

    // Todo: crear JWT
    const token = 'ABC123';

    return {
      token,
      user,
    };
  }
}
