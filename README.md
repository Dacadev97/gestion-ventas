# Gestión de Ventas – Node.js + React

Este repositorio contiene un backend en Node.js (Express + TypeORM + PostgreSQL) y un frontend en React + Vite + TypeScript para gestionar ventas con autenticación JWT, roles (Administrador/Asesor), captcha en login, CRUD de usuarios y ventas, filtros y sumatoria.

## Requisitos

- Node.js 20+
- npm (o pnpm/yarn)
- PostgreSQL 14+

## Variables de entorno

Copia los ejemplos y ajusta:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Backend (`backend/.env`)

- `PORT=4000`
- `JWT_SECRET=define-una-clave-segura`
- `JWT_EXPIRES_IN=1h`
- `CAPTCHA_TTL_SECONDS=120`
- `INITIAL_ADMIN_EMAIL=admin@konecta.local`
- `INITIAL_ADMIN_PASSWORD=Konecta#2024`
- `DB_HOST=localhost`
- `DB_PORT=5432`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=postgres`
- `DB_NAME=konecta`

### Frontend (`frontend/.env`)

- `VITE_API_BASE_URL=http://localhost:4000/api`

## Ejecutar en local

1) Crea la base de datos `konecta` en PostgreSQL.

2) Backend:

```bash
npm --prefix backend install
npm --prefix backend run dev
```

La API queda en `http://localhost:4000/api`. Al iniciar por primera vez se crearán los roles y un usuario administrador (correo y contraseña de `.env`).

3) Frontend:

```bash
npm --prefix frontend install
npm --prefix frontend run dev
```

La app queda en `http://localhost:5173` (o el puerto que indique Vite). Inicia sesión con el admin inicial.

## Scripts útiles

- Backend: `npm --prefix backend run build` y `npm --prefix backend start`
- Frontend: `npm --prefix frontend run build` y `npm --prefix frontend run preview`

## Docker (opcional)

Si usas Docker y docker-compose, consulta más abajo (una vez agregados los archivos de contenedores).

## Seguridad

- Autorización en backend con `authenticate` y `authorize`.
- El frontend valida permisos usando el rol del JWT, no confía en `localStorage` manipulable.

## Tests y CI/CD

- Se incluirán pruebas básicas de backend y workflows de GitHub Actions (CI lint/build/test y despliegue opcional a Cloud Run).

## Despliegue en Cloud Run (opcional)

- Requiere Dockerfile del backend y credenciales de GCP. El workflow usará secretos `GCP_PROJECT_ID`, `GCP_SA_KEY`, `CLOUD_RUN_SERVICE`, `CLOUD_RUN_REGION`.

## Licencia

Uso educativo/demostrativo.
