# FleetCore API

API REST para gestionar el ciclo de vida de los mantenimientos preventivos y correctivos de la flota de vehículos de FleetCore.

**Stack:** NestJS 12 · TypeScript · TypeORM · PostgreSQL 17 · JWT · Swagger · Docker · Vitest

## 👤 Coder

- **Nombre:** _[tu nombre]_
- **Clan:** _[tu clan]_

## 🚀 Requisitos

- Node.js 24 LTS
- Docker y Docker Compose

## ⚙️ Instalación y ejecución

```bash
# 1. Clonar e instalar dependencias
git clone https://github.com/Arp34/Plantilla-nestjs.git
cd Plantilla-nestjs
npm install

# 2. Variables de entorno
cp .env.example .env

# 3. Levantar PostgreSQL
docker compose up -d db

# 4. Poblar la base de datos (idempotente: se puede ejecutar varias veces sin duplicar)
npm run seed

# 5. Iniciar la API en modo desarrollo
npm run start:dev
```

API: `http://localhost:3000/api`

### Opción con Docker (API + PostgreSQL)

```bash
cp .env.example .env
docker compose up -d --build db api
docker exec fleetcore_api node dist/database/seed.js
```

La API y la base de datos se comunican por la red interna `fleetcore-net` y los datos persisten en el volumen `pgdata`.

## 🔐 Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto de la API | `3000` |
| `DB_HOST` / `DB_PORT` | Host y puerto de PostgreSQL | `localhost` / `5433` |
| `DB_USERNAME` / `DB_PASSWORD` | Credenciales de PostgreSQL | `postgres` / `postgres` |
| `DB_NAME` | Nombre de la base de datos | `fleetcore` |
| `DB_SYNC` | Sincroniza el esquema con las entidades (solo desarrollo) | `true` |
| `JWT_SECRET` | Secreto para firmar los tokens (mín. 16 caracteres) | `cambia-este-secreto-...` |
| `JWT_EXPIRES_IN` | Duración del token | `1h` |
| `API_KEYS` | Llaves válidas para integraciones, separadas por coma | `demo-key-partner-1,demo-key-partner-2` |

## 📚 Documentación Swagger

**`http://localhost:3000/docs`**

1. Ejecuta `POST /api/auth/login` con alguna de las credenciales de prueba.
2. Copia el `accessToken` y pégalo en el botón **Authorize → bearer**.
3. Para el endpoint de integraciones, usa **Authorize → api-key** con `demo-key-partner-1`.

## 🔑 Credenciales de prueba (seed)

| Rol | Email | Contraseña | Mecánico vinculado |
|---|---|---|---|
| ADMIN | `admin@fleetcore.com` | `Admin12345` | — |
| TECHNICIAN | `carlos.perez@fleetcore.com` | `Tecnico123` | Carlos Pérez |
| TECHNICIAN | `laura.gomez@fleetcore.com` | `Tecnico123` | Laura Gómez |

API Key de integración: `demo-key-partner-1`

### Datos que carga el seed

- **Usuarios:** 1 ADMIN y 2 TECHNICIAN.
- **Mecánicos:** Carlos Pérez y Laura Gómez (activos, vinculados a los técnicos) y Pedro Ruiz (inactivo).
- **Talleres:** Taller Centro (activo) y Taller Norte (inactivo).
- **Vehículos:** `ABC123` y `DEF456` (AVAILABLE), `GHI789` (IN_MAINTENANCE) y `JKL012` (INACTIVE).
- **Mantenimientos:** 2 COMPLETED de `ABC123` (historial), 1 IN_PROGRESS de `GHI789` y 1 SCHEDULED de `DEF456`.

## 🧭 Endpoints principales

Todas las rutas usan el prefijo `/api`.

| Recurso | Método y ruta | Rol |
|---|---|---|
| Auth | `POST /auth/register` (crea TECHNICIAN) · `POST /auth/login` | Público |
| Usuarios | `POST /users` (cualquier rol) · `GET /users` · `GET /users/:id` | ADMIN |
| | `GET /users/me` | Autenticado |
| Vehículos | `POST /vehicles` · `PATCH /vehicles/:id` · `DELETE /vehicles/:id` (inactiva) · `PATCH /vehicles/:id/activate` | ADMIN |
| | `GET /vehicles` · `GET /vehicles/:id` · `GET /vehicles/plate/:plate` | Autenticado |
| Mecánicos | `POST /mechanics` · `PATCH /mechanics/:id` · `PATCH /mechanics/:id/activate` · `PATCH /mechanics/:id/deactivate` | ADMIN |
| | `GET /mechanics?isActive=` · `GET /mechanics/:id` | Autenticado |
| Talleres | `POST /workshops` · `PATCH /workshops/:id` · `GET /workshops/all` · `PATCH /workshops/:id/activate` · `PATCH /workshops/:id/deactivate` | ADMIN |
| | `GET /workshops` (activos) · `GET /workshops/:id` | Autenticado |
| Mantenimientos | `POST /maintenances` · `GET /maintenances` · `GET /maintenances/active` · `GET /maintenances/vehicle/:vehicleId` · `GET /maintenances/vehicle/:vehicleId/history` · `GET /maintenances/mechanic/:mechanicId` | ADMIN |
| | `GET /maintenances/my` | TECHNICIAN |
| | `GET /maintenances/:id` · `PATCH /maintenances/:id/status` | ADMIN o técnico asignado |
| Integraciones | `GET /integrations/vehicles/:plate/history` | Header `x-api-key` |

## 📏 Reglas de negocio implementadas

- No se crean mantenimientos para vehículos, mecánicos o talleres inexistentes (404) o inactivos (409).
- Un vehículo no puede tener más de un mantenimiento activo (`SCHEDULED` o `IN_PROGRESS`).
- Un mecánico no puede tener mantenimientos activos con horarios cruzados, en ningún taller. Cada mantenimiento tiene `scheduledAt` y `durationMinutes`; los turnos seguidos sí se permiten (7:30–9:00 y 9:00–10:00).
- Un mecánico solo puede tener un mantenimiento `IN_PROGRESS` a la vez.
- El kilometraje del mantenimiento no puede ser inferior al del vehículo.
- Transiciones permitidas: `SCHEDULED → IN_PROGRESS | CANCELLED` e `IN_PROGRESS → COMPLETED | CANCELLED`. `COMPLETED` y `CANCELLED` son estados finales (409).
- `IN_PROGRESS` pasa el vehículo a `IN_MAINTENANCE`. `COMPLETED` exige `workPerformed`, `finalCost`, `finishedAt` y `finalMileage`, devuelve el vehículo a `AVAILABLE` y actualiza su kilometraje.
- Creación y cambios de estado se ejecutan en transacciones con bloqueo de filas (`SELECT ... FOR UPDATE`).
- Respuestas exitosas uniformes (`TransformInterceptor`) y errores uniformes (`AllExceptionsFilter`), incluidos los de base de datos, sin respuestas 500.

## 🧪 Pruebas y evidencias

```bash
npm run test          # unitarias (reglas de estado y auth)
npm run test:cov      # cobertura
npm run test:e2e      # e2e (requiere: docker compose up -d db_test)
```

- **Colección Postman:** [`postman/FleetCore.postman_collection.json`](postman/FleetCore.postman_collection.json). Impórtala y ejecútala en orden con el *Collection Runner* después de `npm run seed`; incluye los escenarios principales con tests automáticos. También se puede ejecutar en terminal con `npx newman run postman/FleetCore.postman_collection.json`.
- **Dump de la base de datos:** [`database/fleetcore_dump.sql`](database/fleetcore_dump.sql), con estructura y datos del seed. Para restaurarlo: `psql -U postgres -d fleetcore -f database/fleetcore_dump.sql`.
