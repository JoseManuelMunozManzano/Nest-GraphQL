import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

import { SingupInput } from './../auth/dto/inputs/signup.input';
import { ErrorHandle } from './../common/error-handle';

@Injectable()
export class UsersService {
  // Usamos el manejo de errores
  private readonly errorHandler: ErrorHandle = new ErrorHandle('UsersService');

  // Para hacer la inserción en la BD tenemos que inyectar nuestro repositorio.
  constructor(
    //  @InjectRepository es para que trabaje dentro del ciclo de vida de Nest.
    // private readonly userRepository es para TypeOrm.
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(signupInput: SingupInput): Promise<User> {
    try {
      // Preparación, pero no graba en BD.
      // Indicar que signupInput tiene 3 campos (email, fullName y password) y los otros que faltan,
      // indicados en User (roles y isActive), tienen indicados valores por defecto.
      const newUser = this.userRepository.create(signupInput);
      // Grabación en BD
      return await this.userRepository.save(newUser);
    } catch (error) {
      // Aquí llegamos, por ejemplo, si intentamos dar de alta el mismo usuario más de una vez.
      this.errorHandler.errorHandle(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOne(id: string): Promise<User> {
    throw new Error(`findOne() not implemented`);
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  async block(id: string): Promise<User> {
    throw new Error(`block() not implemented`);
  }
}
