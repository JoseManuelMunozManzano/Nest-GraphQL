import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRoles } from './../auth/enums/valid-roles.enum';

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
      //
      // Encriptación de contraseña con hash de una sola vía.
      // NO tocamos nuestro signupInput!!
      // Tenemos que instalar el siguiente paquete:
      //  yarn add bcrypt
      // Y para TS
      //  yarn add @types/bcrypt
      const newUser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });

      // Grabación en BD
      return await this.userRepository.save(newUser);
    } catch (error) {
      // Aquí llegamos, por ejemplo, si intentamos dar de alta el mismo usuario más de una vez.
      this.errorHandler.errorHandle(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0) return this.userRepository.find();

    //? Tenemos roles ['admin', 'superUser', ...]
    // Con createQueryBuilder tenemos más control a la hora de hacer las peticiones.
    // getMany() es como el find() para traer el resultado del query builder.
    // Para las consultas de postgresql ver: https://www.postgresql.org/docs/9.6/functions-array.html
    // Es en concreto para hacer búsquedas en arreglos.
    return (
      this.userRepository
        .createQueryBuilder()
        // el primer roles es el campo de la BD y el segundo son los roles que mando por parámetro.
        .andWhere('ARRAY[roles] && ARRAY[:...roles]')
        // Con setParameter podemos escapar caracteres especiales, evitar inyecciones de query...
        // El roles escrito entre comillas se refiere al ARRAY[:...roles] y el segundo roles es
        // el mandado por parámetro.
        .setParameter('roles', roles)
        .getMany()
    );
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      // Si no encuentra el usuario, con el OrFail vamos directos al catch.
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      // Forma normal de tratar la excepción.
      throw new NotFoundException(`${email} not found`);

      // Otra forma de manejar el error. Es muy flexible y nos da mucho poder para hacer lo que queramos.
      // this.errorHandler.errorHandle({
      //   code: 'error-001',
      //   detail: `${email} not found`,
      // });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      // Si no encuentra el usuario, con el OrFail vamos directos al catch.
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      // Forma normal de tratar la excepción.
      throw new NotFoundException(`${id} not found`);
    }
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  async block(id: string): Promise<User> {
    throw new Error(`block() not implemented`);
  }
}
