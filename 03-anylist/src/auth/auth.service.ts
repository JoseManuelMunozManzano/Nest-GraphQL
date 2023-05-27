import { Injectable } from '@nestjs/common';
import { SingupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  async signup(signupInput: SingupInput): Promise<AuthResponse> {
    console.log({ signupInput });
    // Habrá que devolver algo de este tipo
    // return {
    //   token: 'mi_token',
    //   user: new User(),
    // };

    throw new Error('No implementado');
  }
}
