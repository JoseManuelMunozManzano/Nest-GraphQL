import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Item } from './../items/entities/item.entity';
import { User } from './../users/entities/user.entity';

@Injectable()
export class SeedService {
  private isProd: boolean;

  // Protección del SEED.
  //
  // El SEED solo puede ejecutarse en desarrollo.
  // Hay muchas formas de hacer esto.
  //
  // Como el login está en GraphQL, en vez de en REST, no puede protegerse el seed para que solo
  // pueda ejecutarlo un administrador (en headers con Authorization marcado y su token) porque la
  // primera vez NO hay ningún usuario en BD, queremos crearlos, pero va a pedir la autenticación.
  //
  // Lo que vamos a hacer para protegerlo es que en el fichero de variables de entorno (.env) tenemos
  // la variable STATE=dev
  // En producción el valor será STATE=prod
  // Es decir, si vale dev podremos ejecutar el SEED y si vale prod NO podremos ejecutarlo.
  //
  // Para poder usar las variables de entorno recordar que hay que inyectar el ConfigModule
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd) {
      throw new UnauthorizedException('We cannot run SEED in Production');
    }

    // Limpiar la BD - BORRAR TODO
    await this.deleteDatabase();

    // Crear usuarios

    // Crear items

    return true;
  }

  async deleteDatabase() {
    // Borrar items
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // Borrar usuarios
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }
}
