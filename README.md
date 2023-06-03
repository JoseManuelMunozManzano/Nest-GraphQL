# NEST + GraphQL: Evoluciona tus APIs

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

Del curso Udemy https://www.udemy.com/course/nest-graphql/

### 01-foundation

Para refrescar los conocimientos de Nest.
Es un TODO hecho en REST.

Para saber más sobre Nest ver: https://github.com/JoseManuelMunozManzano/nest_desarrollo_escalable

Proyecto creado con:

```
nest new 01-foundation
```

Para levantar el proyecto:

```
cd 01-foundation
yarn start:dev
```

### 02-todo

Es un proyecto TODO pero ahora hecho con GraphQL.
La idea es ir aprendiendo lo básico de Nest+GraphQL.

Webs a visitar para conocer más sobre GraphQL:

- graphql.org
- docs.nestjs.com/graphql
- fireship.io

Proyecto creado con:

```
nest new 02-todo
```

Para levantar el proyecto:

```
cd 02-todo
yarn start:dev
```

Endpoint por defecto:

```
http://localhost:3000/graphql
```

Para instalar GraphQL en Nest: https://docs.nestjs.com/graphql/quick-start

Cosas a ver:

- GraphQL Playground
- Apollo Studio
- Diferentes GUIs para usar GraphQL
- Resolvers
- Args
- Queries
- Instalaciones en Nest
- Alias
- Fragments
- Queries
- Mutations
- Aggregations
- Deprecated directive
- Args
- Inputs
- Custom Types
- Servicios
- CRUD

### 03-anylist

Es un proyecto de backend de aplicación móvil de lista de supermercado hecho en GraphQL.
Servirá para aprender sobre relaciones, endpoints autenticados...

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
