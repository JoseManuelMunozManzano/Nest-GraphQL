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

7. Ejecutar la **"mutation"** executeSeed para llenar la BD con información

Cosas a ver:

- Postgres
- TypeORM
- Entidades con GraphQL Object Types
- CRUD (Queries y Mutations)
- Protección de queries y mutations
- Creación de usuarios desde GraphQL
- Login
- Revalidación de token de autenticación
- JWT
- Relaciones ManyToOne a la misma tabla
- Actualización de usuarios
- Bloqueo de usuarios
- Protección del GqlSchema
- Módulos asíncronos
- Factory functions
- Uso de módulos en factory functions
- Roles y actualización de usuario que modifica registros
- Bloquear GQLSchema
- Relaciones user - item
- Validaciones
- Consultas por usuario
- Indices
- LazyRelationships
- Seed (Llenar la BD con data)
- Paginaciones
- Búsquedas por nombre
- Paginar y buscar de forma simultánea
- Paginar y buscar por items dentro de usuarios
- Aplicar los filtros a la hora de consultar los items de los usuarios

NOTA: Indicar que la autorización y autenticación se hacen con GraphQL para aprender, pero debería hacerse mejor en RESTFul para que solo usuarios autenticados puedan ver la definición de GraphQL.

Si nuestro login y signup están en GraphQL entonces todos los usuarios podrán ver el esquema de GraphQL, ya que necesitarán hacer login.

Para ver como es la autenticación y autorización en REST, mirar: https://github.com/JoseManuelMunozManzano/nest_desarrollo_escalable/tree/main/04-teslo-shop
