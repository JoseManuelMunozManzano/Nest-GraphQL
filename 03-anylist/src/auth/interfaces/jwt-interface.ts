// Lo creamos como interface porque no vamos a crear instancias de esto.
// Nos sirve solo para definir como luce.

// Lo que contiene este tipo lo he sacado con un console.log({payload}) en jwt.strategy.ts, método validate()
export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}
