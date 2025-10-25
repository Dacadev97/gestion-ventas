# 🏦 Sistema de Gestión de Ventas Bancarias

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1-61dafb.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791.svg)](https://www.postgresql.org/)

Sistema completo de gestión de ventas para entidades bancarias, desarrollado con Node.js (Express + TypeORM) en el backend y React (Vite + TypeScript + Redux Toolkit) en el frontend. Incluye autenticación JWT, sistema de roles, captcha de seguridad, módulo de estadísticas y gestión completa de usuarios y ventas.

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Ejecución en Local](#-ejecución-en-local)
- [Docker](#-docker)
- [Testing](#-testing)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Seguridad](#-seguridad)
- [CI/CD](#-cicd)

## ✨ Características Principales

### Autenticación y Seguridad
- 🔐 **Autenticación JWT** con tokens de 1 hora de duración
- 🎨 **Captcha SVG** generado dinámicamente en el login
- 👥 **Sistema de roles**: Administrador y Asesor
- 🛡️ **Autorización granular** en backend y frontend
- 🔒 **Validación de permisos** basada en claims del JWT (no manipulable)

### Gestión de Usuarios (Solo Administrador)
- ➕ Crear usuarios con rol y contraseña
- ✏️ Editar información de usuarios existentes
- 🗑️ Eliminar usuarios del sistema
- 📋 Listar todos los usuarios con paginación

### Gestión de Ventas
- 📝 **Radicar ventas** con productos bancarios:
  - Crédito de Consumo
  - Libranza Libre Inversión
  - Tarjeta de Crédito
- 💰 **Input con máscara** para cupo solicitado (formato moneda)
- 🎯 **Campos condicionales**:
  - Franquicia (solo tarjetas de crédito)
  - Tasa de interés (créditos y libranzas)
- 🏷️ **Estados con badges**: Abierto, En Proceso, Finalizado
- 🔍 **Filtros avanzados**: por producto, rango de fechas
- 💵 **Totalizador** de cupos solicitados
- 📄 **Paginación** con 10 registros por página

### Módulo de Estadísticas
- 📊 **Gráfica por Asesor**: Cantidad de ventas y monto total
- 📈 **Gráfica por Producto**: Distribución de montos
- 📉 **Gráfica Temporal**: Ventas por fecha

## 🛠️ Tecnologías Utilizadas

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express 5.1.0
- **ORM**: TypeORM 0.3.20
- **Base de datos**: PostgreSQL 14+
- **Autenticación**: jsonwebtoken 9.0.2
- **Validación**: express-validator 7.0.1
- **Testing**: Jest 29.7.0 + supertest 7.0.0

### Frontend
- **Framework**: React 19.1.1
- **Build tool**: Vite 7
- **Lenguaje**: TypeScript 5.9.3
- **Estado**: Redux Toolkit 2.9.2
- **UI**: Material-UI 7.3.4
- **Gráficas**: recharts 2.15.1
- **Formularios**: react-hook-form + zod
- **Input masking**: react-number-format 5.4.3
- **Testing**: Vitest 2.1.9 + @testing-library/react 16.1.0

### DevOps
- **Contenedores**: Docker + docker-compose
- **CI/CD**: GitHub Actions
- **Despliegue**: Cloud Run (opcional)

## 📦 Requisitos Previos

- Node.js 20+
- npm (o pnpm/yarn)
- PostgreSQL 14+
- Docker (opcional)

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio

Copia los archivos de ejemplo y ajústalos según tu entorno:

```bash

### Backend (`backend/.env`)

# JWT
JWT_SECRET=define-una-clave-segura-y-compleja
JWT_EXPIRES_IN=1h

# Captcha
CAPTCHA_TTL_SECONDS=120

# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=konecta
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### 3. Crear la base de datos

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE konecta;

# Salir
\q
```

## 🚀 Ejecución en Local

### Opción 1: Instalación tradicional

#### Backend

```bash
# Instalar dependencias
npm --prefix backend install

# Modo desarrollo (con hot-reload)
npm --prefix backend run dev

# Modo producción
npm --prefix backend run build
npm --prefix backend start
```

El backend estará disponible en `http://localhost:4000/api`

**Nota**: Al iniciar por primera vez, se crearán automáticamente:
- Roles: Administrador y Asesor
- Usuario administrador con las credenciales de `.env`

#### Frontend

```bash
# Instalar dependencias
npm --prefix frontend install

# Modo desarrollo
npm --prefix frontend run dev

# Modo producción
npm --prefix frontend run build
npm --prefix frontend run preview
```

El frontend estará disponible en `http://localhost:5173` (o el puerto que indique Vite)

### Opción 2: Con Docker Compose

```bash
# Construir e iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

Servicios disponibles:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4000/api
- **PostgreSQL**: localhost:5432

## 🐳 Docker

El proyecto incluye configuración completa de Docker:

### Estructura de contenedores

```
├── backend/
│   └── Dockerfile          # Node 20 Alpine + TypeScript
├── frontend/
│   └── Dockerfile          # Build multi-stage con Nginx
└── docker-compose.yml      # Orquestación de servicios
```

### Servicios en docker-compose

- **postgres**: PostgreSQL 15 con volumen persistente
- **backend**: API Node.js en puerto 4000
- **frontend**: Aplicación React servida por Nginx en puerto 3000

## 🧪 Testing

El proyecto incluye pruebas automatizadas para backend y frontend.

### Backend (Jest)

```bash
# Ejecutar tests
npm --prefix backend test

# Tests con cobertura
npm --prefix backend test -- --coverage

# Watch mode
npm --prefix backend test -- --watch
```

**Tests incluidos:**
- ✅ Health endpoint
- ✅ Autenticación middleware (401)
- ✅ SaleService (integración con DB)

### Frontend (Vitest)

```bash
# Ejecutar tests
npm --prefix frontend test

# Tests en modo watch
npm --prefix frontend test -- --watch

# UI mode
npm --prefix frontend test -- --ui
```

**Tests incluidos:**
- ✅ Utilidades JWT (11 tests)
- ✅ RequireAuth component
- ✅ Renderizado de componentes

### Ejecución completa

```bash
# Backend + Frontend
npm --prefix backend test && npm --prefix frontend test -- --run
```

## 📁 Estructura del Proyecto

```
konecta/
├── backend/
│   ├── src/
│   │   ├── bootstrap/          # Seeds y inicialización
│   │   ├── config/             # Configuración de entorno
│   │   ├── controllers/        # Controladores REST
│   │   ├── entities/           # Entidades TypeORM
│   │   ├── errors/             # Manejo de errores
│   │   ├── middlewares/        # Auth, validación, errores
│   │   ├── routes/             # Definición de rutas
│   │   ├── services/           # Lógica de negocio
│   │   ├── types/              # Type definitions
│   │   ├── utils/              # Utilidades (JWT, password)
│   │   ├── validators/         # Validadores express-validator
│   │   ├── app.ts              # Configuración Express
│   │   ├── data-source.ts      # Configuración TypeORM
│   │   └── index.ts            # Entry point
│   ├── __tests__/              # Tests Jest
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                # Clients HTTP
│   │   ├── assets/             # Recursos estáticos
│   │   ├── components/         # Componentes React
│   │   ├── features/           # Redux slices
│   │   ├── hooks/              # Custom hooks
│   │   ├── layouts/            # Layouts principales
│   │   ├── pages/              # Páginas/vistas
│   │   ├── routes/             # Configuración routing
│   │   ├── store/              # Store Redux
│   │   ├── test/               # Tests Vitest
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Utilidades
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Pipeline CI
│       ├── deploy-cloudrun.yml        # Deploy Backend a Cloud Run
│       └── deploy-frontend.yml        # Deploy Frontend a Cloud Run (depende del backend)
├── docker-compose.yml
└── README.md
```

## 🔌 API Endpoints

### Autenticación

```
POST   /api/auth/login          # Login con captcha
GET    /api/auth/me             # Obtener usuario actual
```

### Captcha

```
GET    /api/captcha             # Generar captcha SVG
```

### Usuarios (requiere autenticación)

```
GET    /api/users               # Listar usuarios (Admin)
POST   /api/users               # Crear usuario (Admin)
PATCH  /api/users/:id           # Actualizar usuario (Admin)
DELETE /api/users/:id           # Eliminar usuario (Admin)
```

### Ventas (requiere autenticación)

```
GET    /api/sales               # Listar ventas (paginado, filtros)
GET    /api/sales/stats         # Estadísticas agregadas
GET    /api/sales/:id           # Obtener venta por ID
POST   /api/sales               # Crear venta
PATCH  /api/sales/:id           # Actualizar venta
PATCH  /api/sales/:id/status    # Cambiar estado
DELETE /api/sales/:id           # Eliminar venta (Admin)
```

### Parámetros de Query (Sales)

```
?page=1                          # Número de página (default: 1)
?limit=10                        # Registros por página (default: 10)
?sortBy=created_at              # Campo de ordenamiento
?sortOrder=DESC                 # Orden: ASC o DESC
?product=Credito+de+Consumo    # Filtro por producto
?createdFrom=2025-01-01        # Filtro fecha desde
?createdTo=2025-12-31          # Filtro fecha hasta
```

## 🔒 Seguridad

### Autenticación y Autorización

- **Backend**: Middleware `authenticate` valida JWT en cada request
- **Backend**: Middleware `authorize` verifica roles permitidos
- **Frontend**: Token almacenado en `localStorage` (solo para UI)
- **Frontend**: Permisos basados en **claims del JWT**, no en estado local manipulable

### Validación

- **Doble capa de validación**:
  - Backend: `express-validator` antes de procesamiento
  - Frontend: `zod` + `react-hook-form` en formularios

### Protección CSRF

- Token JWT en header `Authorization: Bearer <token>`
- No se usan cookies para autenticación

### Captcha

- SVG generado dinámicamente con caracteres aleatorios
- TTL configurable (default: 120 segundos)
- Validación en backend antes de login

## 🚢 CI/CD

### GitHub Actions

El proyecto incluye dos workflows:

#### 1. CI Pipeline (`.github/workflows/ci.yml`)

Se ejecuta en cada push y pull request:

```yaml
- Checkout código
- Instalar Node.js 20
- Instalar dependencias (backend + frontend)
- Lint (ESLint)
- Build (TypeScript compilation)
- Tests (Jest + Vitest)
- PostgreSQL service para tests de integración
```

#### 2. Deploy Cloud Run (`.github/workflows/deploy-cloudrun.yml`)

Despliegue automático a Google Cloud Run:

**Configuración rápida:**
```bash
#  Script automatizado (recomendado)
./setup-gcp.sh

```

**Secretos requeridos en GitHub (Backend):**
- `GCP_SA_KEY`: Service Account key (JSON completo)
- `GCP_PROJECT_ID`: tech-dx-471318
- `CLOUD_RUN_REGION`: us-central1
- `CLOUD_RUN_SERVICE`: konecta-backend
- `ARTIFACT_REGISTRY_REPO`: konecta-backend-repo
- `CLOUD_SQL_CONNECTION_NAME`: tech-dx-471318:us-central1:konecta-database
- `BACKEND_ENV_VARS`: Variables de entorno (NO incluir PORT)

**Secretos requeridos en GitHub (Frontend):**
- `ARTIFACT_REGISTRY_REPO_FRONTEND`: konecta-frontend-repo
- `CLOUD_RUN_SERVICE_FRONTEND`: konecta-frontend
- `BACKEND_URL`: URL pública del backend + "/api"

Pasos rápidos (Cloud Run):
1) Ejecuta `./setup-gcp.sh` para crear infraestructura y generar el archivo con secrets.
2) Carga los secrets en GitHub (Settings → Secrets and variables → Actions).
3) Push a `main` para desplegar el backend. Obtén su URL:
   ```bash
   gcloud run services describe konecta-backend \
     --region us-central1 \
     --format="value(status.url)"
   ```
4) Actualiza `BACKEND_URL` con `<URL_BACKEND>/api`.
5) Ejecuta el workflow "Deploy Frontend to Cloud Run" (automático tras backend success o manualmente).
6) Verifica ambos servicios accediendo a las URLs desplegadas.

## 🌐 Despliegue en Google Cloud Run

### Setup Automático ⚡

El proyecto incluye un script de configuración automatizada que crea toda la infraestructura necesaria:

```bash
# Ejecutar script de configuración
./setup-gcp.sh
```

El script creará automáticamente:
- ✅ Cloud SQL (PostgreSQL 14)
- ✅ Artifact Registry para imágenes Docker
- ✅ Service Account con permisos
- ✅ Passwords seguros generados automáticamente
- ✅ Archivo con todos los secrets para GitHub

### Deployment Manual (todo aquí mismo)

Si prefieres configurar manualmente o necesitas más control, estos son los pasos mínimos:

1. Crear los recursos en GCP (Artifact Registry, Cloud SQL, Service Account) con el script o manualmente.
2. En GitHub → Settings → Secrets and variables → Actions, crear los secrets requeridos (ver lista arriba) con los valores de tu proyecto.
3. Desplegar el backend (push a main o ejecutar el workflow "Deploy Backend to Cloud Run").
4. Obtener la URL del backend y actualizar el secret `BACKEND_URL` con `<URL_BACKEND>/api`.
5. Desplegar el frontend (se dispara automáticamente tras el backend success o ejecútalo manualmente).
6. Verificar:
  - Backend: `GET <URL_BACKEND>/health` → `{ "status": "ok" }`
  - Frontend: abrir la URL de Cloud Run y probar login y ventas.

### Verificar Deployment

Backend desplegado (Cloud Run):

https://konecta-backend-512974314058.us-central1.run.app/health

Frontend desplegado (Cloud Run):

https://konecta-frontend-512974314058.us-central1.run.app/

```bash
# Ver servicios desplegados
gcloud run services list --platform managed

# Obtener URL del servicio
gcloud run services describe konecta-backend \
  --region us-central1 \
  --format "value(status.url)"

# Probar endpoint
curl $(gcloud run services describe konecta-backend \
  --region us-central1 \
  --format "value(status.url)")/health
```

### Costos Estimados

- **Cloud Run**: GRATIS hasta 2M requests/mes
- **Cloud SQL (db-f1-micro)**: ~$7-10 USD/mes
- **Total estimado**: $7-15 USD/mes

## 👥 Usuarios por Defecto

Al iniciar el sistema por primera vez, se crea automáticamente:

**Administrador:**
- Email: `admin@konecta.local` (configurable en `.env`)
- Password: `H6ZeoOhnoaC1xpDpgsFTJw==` (configurable en `.env`)

Desde esta cuenta puedes crear más usuarios (asesores o administradores).

## 🐛 Troubleshooting

### Error de conexión a PostgreSQL

```bash
# Verificar que PostgreSQL esté corriendo
sudo service postgresql status

# Verificar credenciales en .env
cat backend/.env | grep DB_
```

### Error "Port already in use"

```bash
# Backend (puerto 4000)
lsof -ti:4000 | xargs kill -9

# Frontend (puerto 5173)
lsof -ti:5173 | xargs kill -9
```

### Tests fallan por memoria

```bash
# Frontend: aumentar heap size
NODE_OPTIONS="--max-old-space-size=4096" npm --prefix frontend test
```

### Despliegue en Cloud Run: problemas comunes

- Error: "The following reserved env names were provided: PORT"
  - Causa: Intentar definir `PORT` en Cloud Run. Ese valor lo establece Google.
  - Solución: Quita `PORT` de `BACKEND_ENV_VARS` y vuelve a desplegar.

- Error: "Cannot find module '/app/dist/index.js'"
  - Causa: El build de TypeScript no generó `dist/` correctamente en el contenedor.
  - Solución: Asegúrate de que `tsconfig.json` tenga `rootDir: ./src` y que el Dockerfile build copie desde el stage builder:
    - `RUN npm run build`
    - `COPY --from=builder /app/dist ./dist`

- Error: "relation 'roles' does not exist" (TypeORM)
  - Causa: La base de datos está vacía y las tablas no se han creado.
  - Soluciones:
    1) Temporal: habilitar `synchronize: true` para crear tablas en el primer despliegue.
    2) Recomendado: crear migraciones y aplicarlas en el startup.

- El contenedor no arranca a tiempo (HealthCheckContainerError)
  - Solución: Aumentar el timeout del servicio y evitar throttling inicial (ya configurado en el workflow con `--timeout 300` y `--no-cpu-throttling`).

- Conexión a Cloud SQL falla
  - Revisa que `CLOUD_SQL_CONNECTION_NAME` tenga formato `project:region:instance`.
  - Usa socket Unix: `DB_HOST=/cloudsql/<connection_name>`.
  - Da rol `roles/cloudsql.client` al Service Account de despliegue.

## 📝 Licencia

Este proyecto es de uso educativo y demostrativo.

## 👨‍💻 Autor

**Davidson Cadavid** - [Dacadev97](https://github.com/Dacadev97)

---

