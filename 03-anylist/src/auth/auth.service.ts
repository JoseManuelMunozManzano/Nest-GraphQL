import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { SingupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from './../users/users.service';
import { User } from './../users/entities/user.entity';

@Injectable()
export class AuthService {
  // Inyectando UsersService (se ha exportado en users.module.ts e importado en auth.module.ts)
  // para poder hacer uso del mismo.
  constructor(
    private readonly usersService: UsersService,
    // Para poder firmar nuestro JWT Tokens
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async signup(signupInput: SingupInput): Promise<AuthResponse> {
    // La creación de los usuarios la vamos a delegar al servicio de los usuarios.
    const user = await this.usersService.create(signupInput);

    // Crear JWT con nuestro id.
    // Solo con el id ya puedo saber todo sobre el usuario que intenta acceder.
    // Hasta donde se pueda, grabar lo mínimo posible en el JWT ya que el payload es muy fácil de ver y viaja
    // en la petición (en nuestro header como un bearer token)
    const token = this.getJwtToken(user.id);

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

    // Crear JWT con nuestro id.
    const token = this.getJwtToken(user.id);

    return {
      token,
      user,
    };
  }

  // Validación del usuario
  async validateUser(id: string): Promise<User> {
    // Si no se encuentra, en el mismo findOneById ya tenemos un throw para lanzar la excepción.
    const user = await this.usersService.findOneById(id);

    if (!user.isActive)
      throw new UnauthorizedException(`User is inactive, talk with an admin`);

    // Para asegurarnos que el password no pasa en el request.
    delete user.password;

    return user;
  }

  // No devuelve una promesa porque no necesito hacer nada asíncrono
  revalidateToken(user: User): AuthResponse {
    // Para cumplir la firma de AuthResponse

    // Este es el token
    const token = this.getJwtToken(user.id);

    // Y aquí devolvemos el token y el usuario
    return {
      token,
      user,
    };
  }
}
