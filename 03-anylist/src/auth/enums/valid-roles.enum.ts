// Enumeración, propia de TS para indicar los roles disponibles.
// Lo acaberemos transformando en un objeto de tipo Enumeración de GraphQL para que este lo reconozca en Apollo.
// TODO: Implementar enum como GraphQL Enum Type
export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  superUser = 'superUser',
}
