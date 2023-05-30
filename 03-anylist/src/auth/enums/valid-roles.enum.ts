import { registerEnumType } from '@nestjs/graphql';
// Enumeración, propia de TS para indicar los roles disponibles.
//
// Las enumeraciones en GraphQL funcionan exactamente igual a las enumeraciones en TypeScript
// https://graphql.org/learn/schema/#enumeration-types
export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  superUser = 'superUser',
}

// Para hacer que el enumerador sea entendible por GraphQL hay que registrar la enumeración.
// En name va el nombre para GraphQL (para el schema). Igual la descripción.
// Con esto, en Apollo, al definir los roles, solo podemos poder los indicados en la enumeración.
// Si indicamos otro valor, el query es incorrecto y no va a llegar ni a ejecutarse (Ver Query AllUsers en Apollo)
registerEnumType(ValidRoles, {
  name: 'ValidRoles',
  description: 'Roles permitidos',
});
