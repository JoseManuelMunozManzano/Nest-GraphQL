# 03-anylist

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

Es un proyecto de backend de aplicación móvil de lista de supermercado hecho en GraphQL.
Servirá para aprender sobre relaciones, endpoints autenticados...

## Dev

1. Clonar el proyecto
2. Copiar el `env.template` y renombrar a `.env`
3. Ejecutar

```
yarn install
```

4. Levantar la imagen (Docker desktop)

```
docker-compose up -d
```

5. Levantar el backend de Nest

```
yarn start:dev
```

6. Visitar el sitio

```
http://localhost:3000/graphql
```

Cosas a ver:

- Postgres
- TypeORM
- Entidades con GraphQL Object Types
- CRUD (Queries y Mutations)
