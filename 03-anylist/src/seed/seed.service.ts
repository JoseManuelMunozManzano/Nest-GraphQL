import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  constructor() {}

  async executeSeed(): Promise<boolean> {
    // Limpiar la BD - BORRAR TODO

    // Crear usuarios

    // Crear items

    return true;
  }
}
