# MF Login

Microfrontend que gestiona autenticación y persistencia de datos del usuario.

## Ejecución en local

### 1. Instalar dependencias:

```bash
npm install
```

### 2. Ejecutar:

```bash
ng serve
```

o ejecucion en local sin escuchar cambios (estatico)

```bash
npm run start:static
```

## Pruebas Unitarias

```bash
npm run test
```

La pagina se expone en `http://localhost:4202/` 

El front consume una api publica de autenticacion: https://dummyjson.com/docs/auth

Puede ingresar con cualquier usuario expuesto por la api, para ver los usuarios disponibles: https://dummyjson.com/users