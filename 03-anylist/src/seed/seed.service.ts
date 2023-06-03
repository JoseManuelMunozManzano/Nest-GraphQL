import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
  constructor(private readonly configService: ConfigService) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd) {
      throw new UnauthorizedException('We cannot run SEED in Production');
    }

    // Limpiar la BD - BORRAR TODO

    // Crear usuarios

    // Crear items

    return true;
  }
}
