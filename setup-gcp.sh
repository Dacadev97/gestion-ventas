#!/bin/bash

# Script de configuración automatizada para Google Cloud Run
# Proyecto: Sistema de Gestión de Ventas Bancarias
# Author: Dacadev97

set -e  # Exit on error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables de configuración
PROJECT_ID="tech-dx-471318"
REGION="us-central1"
DB_INSTANCE="konecta-database"
DB_NAME="konecta"
DB_USER="konecta_user"
REPO_NAME_BACKEND="konecta-backend-repo"
REPO_NAME_FRONTEND="konecta-frontend-repo"
SERVICE_NAME_BACKEND="konecta-backend"
SERVICE_NAME_FRONTEND="konecta-frontend"
SA_NAME="github-actions-deploy"

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Configuración de Google Cloud Run - Sistema de Ventas${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Verificar que gcloud esté instalado
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI no está instalado${NC}"
    echo "Por favor instala gcloud desde: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo -e "${GREEN}✓ gcloud CLI detectado${NC}"
echo ""

# Generar passwords seguros
echo -e "${YELLOW}🔐 Generando passwords seguros...${NC}"
DB_ROOT_PASSWORD=$(openssl rand -base64 32)
DB_USER_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
ADMIN_PASSWORD=$(openssl rand -base64 16)

echo -e "${GREEN}✓ Passwords generados${NC}"
echo ""

# Crear archivo de secrets
SECRETS_FILE="gcp-secrets-$(date +%Y%m%d-%H%M%S).txt"
cat > "$SECRETS_FILE" << EOF
# Secrets de Google Cloud Platform
# Fecha: $(date)
# Proyecto: $PROJECT_ID
# GUARDAR ESTE ARCHIVO DE FORMA SEGURA - CONTIENE INFORMACIÓN SENSIBLE

=== Database Passwords ===
DB_ROOT_PASSWORD: $DB_ROOT_PASSWORD
DB_USER: $DB_USER
DB_USER_PASSWORD: $DB_USER_PASSWORD
DB_NAME: $DB_NAME

=== Application Secrets ===
JWT_SECRET: $JWT_SECRET
ADMIN_EMAIL: admin@konecta.local
ADMIN_PASSWORD: $ADMIN_PASSWORD

=== Cloud SQL Connection ===
DB_INSTANCE: $DB_INSTANCE
CONNECTION_NAME: $PROJECT_ID:$REGION:$DB_INSTANCE

=== Service Account ===
SA_EMAIL: ${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com
SA_KEY_FILE: ~/gcp-key-konecta.json

EOF

echo -e "${GREEN}✓ Secrets guardados en: $SECRETS_FILE${NC}"
echo ""

# 1. Configurar proyecto
echo -e "${BLUE}[1/8] Configurando proyecto GCP...${NC}"
gcloud config set project $PROJECT_ID
echo -e "${GREEN}✓ Proyecto configurado: $PROJECT_ID${NC}"
echo ""

# 2. Habilitar APIs
echo -e "${BLUE}[2/8] Habilitando APIs necesarias...${NC}"
gcloud services enable run.googleapis.com --quiet
gcloud services enable sqladmin.googleapis.com --quiet
gcloud services enable artifactregistry.googleapis.com --quiet
gcloud services enable cloudbuild.googleapis.com --quiet
echo -e "${GREEN}✓ APIs habilitadas${NC}"
echo ""

# 3. Crear Artifact Registry
echo -e "${BLUE}[3/8] Creando Artifact Registry...${NC}"

# Crear repositorio para backend
if gcloud artifacts repositories describe $REPO_NAME_BACKEND --location=$REGION &> /dev/null; then
    echo -e "${YELLOW}⚠ Repositorio backend ya existe, omitiendo...${NC}"
else
    gcloud artifacts repositories create $REPO_NAME_BACKEND \
      --repository-format=docker \
      --location=$REGION \
      --description="Konecta backend images" \
      --quiet
    echo -e "${GREEN}✓ Artifact Registry backend creado${NC}"
fi

# Crear repositorio para frontend
if gcloud artifacts repositories describe $REPO_NAME_FRONTEND --location=$REGION &> /dev/null; then
    echo -e "${YELLOW}⚠ Repositorio frontend ya existe, omitiendo...${NC}"
else
    gcloud artifacts repositories create $REPO_NAME_FRONTEND \
      --repository-format=docker \
      --location=$REGION \
      --description="Konecta frontend images" \
      --quiet
    echo -e "${GREEN}✓ Artifact Registry frontend creado${NC}"
fi

# Configurar autenticación de Docker
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet
echo -e "${GREEN}✓ Docker autenticado${NC}"
echo ""

# 4. Crear Cloud SQL
echo -e "${BLUE}[4/8] Creando Cloud SQL (esto puede tardar varios minutos)...${NC}"
if gcloud sql instances describe $DB_INSTANCE &> /dev/null; then
    echo -e "${YELLOW}⚠ Instancia Cloud SQL ya existe, omitiendo...${NC}"
else
    gcloud sql instances create $DB_INSTANCE \
      --database-version=POSTGRES_14 \
      --tier=db-f1-micro \
      --region=$REGION \
      --root-password="$DB_ROOT_PASSWORD" \
      --storage-type=SSD \
      --storage-size=10GB \
      --backup-start-time=03:00 \
      --quiet
    echo -e "${GREEN}✓ Cloud SQL instance creada${NC}"
fi
echo ""

# 5. Crear base de datos y usuario
echo -e "${BLUE}[5/8] Configurando base de datos...${NC}"
if gcloud sql databases describe $DB_NAME --instance=$DB_INSTANCE &> /dev/null; then
    echo -e "${YELLOW}⚠ Base de datos ya existe, omitiendo...${NC}"
else
    gcloud sql databases create $DB_NAME --instance=$DB_INSTANCE --quiet
    echo -e "${GREEN}✓ Base de datos creada${NC}"
fi

# Verificar si el usuario existe
if gcloud sql users list --instance=$DB_INSTANCE --filter="name:$DB_USER" --format="value(name)" | grep -q "$DB_USER"; then
    echo -e "${YELLOW}⚠ Usuario de base de datos ya existe, omitiendo...${NC}"
else
    gcloud sql users create $DB_USER \
      --instance=$DB_INSTANCE \
      --password="$DB_USER_PASSWORD" \
      --quiet
    echo -e "${GREEN}✓ Usuario de base de datos creado${NC}"
fi
echo ""

# 6. Crear Service Account
echo -e "${BLUE}[6/8] Creando Service Account...${NC}"
if gcloud iam service-accounts describe ${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com &> /dev/null; then
    echo -e "${YELLOW}⚠ Service Account ya existe, omitiendo...${NC}"
else
    gcloud iam service-accounts create $SA_NAME \
      --display-name="GitHub Actions Deployment" \
      --description="Service account para deployments desde GitHub Actions" \
      --quiet
    echo -e "${GREEN}✓ Service Account creado${NC}"
fi
echo ""

# 7. Asignar permisos
echo -e "${BLUE}[7/8] Asignando permisos...${NC}"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

ROLES=(
    "roles/run.admin"
    "roles/cloudsql.client"
    "roles/artifactregistry.writer"
    "roles/storage.admin"
    "roles/iam.serviceAccountUser"
)

for ROLE in "${ROLES[@]}"; do
    gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:$SA_EMAIL" \
      --role="$ROLE" \
      --quiet &> /dev/null
    echo -e "${GREEN}✓ Rol asignado: $ROLE${NC}"
done
echo ""

# 8. Crear key del Service Account
echo -e "${BLUE}[8/8] Creando key del Service Account...${NC}"
KEY_FILE=~/gcp-key-konecta.json
if [ -f "$KEY_FILE" ]; then
    echo -e "${YELLOW}⚠ Key file ya existe en: $KEY_FILE${NC}"
    read -p "¿Deseas sobrescribirlo? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}⚠ Usando key existente${NC}"
    else
        rm "$KEY_FILE"
        gcloud iam service-accounts keys create "$KEY_FILE" \
          --iam-account=$SA_EMAIL \
          --quiet
        echo -e "${GREEN}✓ Nueva key creada${NC}"
    fi
else
    gcloud iam service-accounts keys create "$KEY_FILE" \
      --iam-account=$SA_EMAIL \
      --quiet
    echo -e "${GREEN}✓ Key del Service Account creada${NC}"
fi
echo ""

# Obtener información de Cloud SQL
CONNECTION_NAME=$(gcloud sql instances describe $DB_INSTANCE --format="value(connectionName)")

# Nota: La URL del backend se obtendrá después del primer deploy
# Por ahora usamos un placeholder que se debe reemplazar después
BACKEND_URL_PLACEHOLDER="https://${SERVICE_NAME_BACKEND}-XXXXXX-uc.a.run.app/api"

# Agregar información al archivo de secrets
cat >> "$SECRETS_FILE" << EOF

=== GitHub Secrets Configuration (BACKEND) ===

GCP_SA_KEY:
Copiar el contenido completo del archivo: $KEY_FILE
Comando: cat $KEY_FILE

GCP_PROJECT_ID: $PROJECT_ID

CLOUD_RUN_REGION: $REGION

ARTIFACT_REGISTRY_REPO: $REPO_NAME_BACKEND

CLOUD_RUN_SERVICE: $SERVICE_NAME_BACKEND

CLOUD_SQL_CONNECTION_NAME: $CONNECTION_NAME

BACKEND_ENV_VARS:
NODE_ENV=production,PORT=8080,JWT_SECRET=$JWT_SECRET,JWT_EXPIRES_IN=1h,CAPTCHA_TTL_SECONDS=120,INITIAL_ADMIN_EMAIL=admin@konecta.local,INITIAL_ADMIN_PASSWORD=$ADMIN_PASSWORD,DB_HOST=/cloudsql/$CONNECTION_NAME,DB_PORT=5432,DB_USERNAME=$DB_USER,DB_PASSWORD=$DB_USER_PASSWORD,DB_NAME=$DB_NAME

=== GitHub Secrets Configuration (FRONTEND) ===

ARTIFACT_REGISTRY_REPO_FRONTEND: $REPO_NAME_FRONTEND

CLOUD_RUN_SERVICE_FRONTEND: $SERVICE_NAME_FRONTEND

BACKEND_URL: $BACKEND_URL_PLACEHOLDER
(⚠️ IMPORTANTE: Después del primer deploy del backend, ejecuta:
  gcloud run services describe $SERVICE_NAME_BACKEND --region $REGION --format="value(status.url)"
  Y actualiza este secret con la URL real + /api)

EOF

# Resumen final
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ ¡Configuración completada exitosamente!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📋 Información importante:${NC}"
echo ""
echo -e "1. ${GREEN}Secrets guardados en:${NC} $SECRETS_FILE"
echo -e "2. ${GREEN}Service Account Key:${NC} $KEY_FILE"
echo -e "3. ${GREEN}Proyecto GCP:${NC} $PROJECT_ID"
echo -e "4. ${GREEN}Cloud SQL Connection:${NC} $CONNECTION_NAME"
echo ""
echo -e "${YELLOW}🔐 Próximos pasos:${NC}"
echo ""
echo -e "1. Ir a GitHub: ${BLUE}https://github.com/Dacadev97/gestion-ventas/settings/secrets/actions${NC}"
echo ""
echo -e "2. Agregar los siguientes secrets (ver $SECRETS_FILE):"
echo -e "   ${YELLOW}Backend:${NC}"
echo -e "   ${GREEN}•${NC} GCP_SA_KEY"
echo -e "   ${GREEN}•${NC} GCP_PROJECT_ID"
echo -e "   ${GREEN}•${NC} CLOUD_RUN_REGION"
echo -e "   ${GREEN}•${NC} ARTIFACT_REGISTRY_REPO"
echo -e "   ${GREEN}•${NC} CLOUD_RUN_SERVICE"
echo -e "   ${GREEN}•${NC} CLOUD_SQL_CONNECTION_NAME"
echo -e "   ${GREEN}•${NC} BACKEND_ENV_VARS"
echo -e "   ${YELLOW}Frontend:${NC}"
echo -e "   ${GREEN}•${NC} ARTIFACT_REGISTRY_REPO_FRONTEND"
echo -e "   ${GREEN}•${NC} CLOUD_RUN_SERVICE_FRONTEND"
echo -e "   ${GREEN}•${NC} BACKEND_URL (actualizar después del deploy del backend)"
echo ""
echo -e "3. Hacer push al repositorio para activar el deployment"
echo ""
echo -e "${RED}⚠️  IMPORTANTE:${NC}"
echo -e "   ${RED}•${NC} Guarda el archivo $SECRETS_FILE en un lugar seguro"
echo -e "   ${RED}•${NC} NO compartas estos valores públicamente"
echo -e "   ${RED}•${NC} Considera usar Secret Manager para producción"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Para ver el contenido del Service Account Key, ejecuta:${NC}"
echo -e "${BLUE}cat $KEY_FILE${NC}"
echo ""
echo -e "${GREEN}Para verificar el deployment después:${NC}"
echo -e "${BLUE}gcloud run services list --platform managed${NC}"
echo ""
