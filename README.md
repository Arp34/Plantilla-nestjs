# Proyecto Base - API NestJS 12

API REST construida con NestJS 12 (ESM), TypeORM, PostgreSQL y Docker. Incluye autenticación con JWT, roles (RBAC) y tests con Vitest.

## 🚀 Requisitos
- Node.js 24 LTS
- Docker Desktop

## ⚙️ Instalación y Ejecución
1. Clonar el repositorio.
2. Copiar las variables de entorno: `cp .env.example .env`
3. Levantar las bases de datos: `docker compose up -d`
4. Instalar dependencias: `npm install`
5. Iniciar en desarrollo: `npm run start:dev`

## 📚 Documentación
La documentación interactiva de Swagger está disponible en: `http://localhost:3000/docs`

**Credenciales de Administrador (Seed):**
- Email: `admin@prueba.com`
- Password: `Admin12345`

## 🧪 Pruebas
- Unitarias: `npm run test`
- Integración (e2e): `npm run test:e2e`
- Cobertura: `npm run test:cov`