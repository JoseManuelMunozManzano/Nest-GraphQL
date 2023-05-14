// Esto lo creamos primero con el mandato CLI
// nest g mo helloWorld
//
// Es un ejemplito para empezar con GraphQL.
// Veremos más adelante que todo esto se puede crear de forma casi instantanea con generadores, pero primero
// vamos a hacerlo manual para aprender.
import { Module } from '@nestjs/common';
import { HelloWorldResolver } from './hello-world.resolver';

@Module({
  providers: [HelloWorldResolver],
})
export class HelloWorldModule {}
