import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class ErrorHandle {
  private readonly logger: Logger;

  constructor(private serviceName: string) {
    this.logger = new Logger(serviceName);
  }

  // Se añade que esta función devuelve never para asegurarnos de no añadir un return por error.
  public errorHandle(error: any): never {
    // Usando el logger. Se ve en consola de Nest
    this.logger.error(`${error} - ${error.detail}`);

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
