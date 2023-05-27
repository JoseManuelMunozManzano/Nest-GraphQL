import { Injectable } from '@nestjs/common';

import { SingupInput } from './dto/inputs/signup.input';
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
}
