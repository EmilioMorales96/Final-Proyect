# Guía de Seguridad - Información Sensible

## ⚠️ IMPORTANTE: Archivos que NO deben subirse al repositorio

### Archivos de Entorno
- ❌ `.env` (cualquier variante)
- ❌ `backend/.env`
- ❌ `frontend/.env`
- ✅ `.env.example` (SÍ se debe incluir como plantilla)

### Credenciales y Claves
- ❌ Cualquier archivo con credenciales reales de base de datos
- ❌ Tokens de API (Salesforce, OneDrive, Dropbox)
- ❌ Claves JWT secretas
- ❌ Certificados y claves privadas (.pem, .key, .p12)

### Archivos de Configuración
- ❌ `config.json` con datos de producción
- ❌ `credentials.json`
- ❌ Service account keys de Google Cloud
- ❌ AWS credentials

## 🔒 Información Sensible Detectada y Eliminada

Durante la preparación del repositorio se encontraron y eliminaron:

1. **`backend/.env`** - Contenía credenciales reales de Neon PostgreSQL:
   - Host: ep-flat-dust-a8o7mmbc-pooler.eastus2.azure.neon.tech
   - Usuario y contraseña de base de datos
   - ⚠️ **NUNCA subir estas credenciales al repositorio**

2. **`frontend/.env`** - Contenía URL del backend en producción:
   - VITE_API_URL=https://backend-service-pu47.onrender.com

## ✅ Mejoras Implementadas en .gitignore

### Protección de Archivos de Entorno
```gitignore
.env
.env.*
!.env.example
backend/.env
frontend/.env
```

### Protección de Credenciales
```gitignore
backend/config/config.json
credentials.json
keys.json
*.pem
*.key
private_key.json
service-account-key.json
```

### Protección de Uploads y Datos de Usuario
```gitignore
uploads/
backend/uploads/
temp/
tmp/
```

### Protección de Integraciones
```gitignore
salesforce_credentials.json
onedrive_tokens.json
dropbox_tokens.json
oauth_tokens.json
api_keys.json
```

## 📋 Checklist Antes de Subir al Repositorio

- [x] Archivos `.env` eliminados
- [x] `.gitignore` actualizado con protecciones completas
- [x] No hay credenciales hardcodeadas en el código
- [x] Archivo `.env.example` creado como plantilla
- [x] Documentación de deployment actualizada

## 🚀 Configuración para Deployment

### Variables de Entorno en Render
Configurar manualmente en el dashboard de Render:
```
DATABASE_URL=<neon-connection-string>
JWT_SECRET=<generate-new-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
```

### Variables de Entorno para el Frontend
Configurar en Render Static Site:
```
VITE_API_URL=https://your-backend-app.onrender.com
```

## 📖 Mejores Prácticas

1. **Nunca hardcodear credenciales** en el código fuente
2. **Usar variables de entorno** para toda información sensible
3. **Revisar .gitignore** antes de cada commit
4. **Generar nuevos secrets** para producción
5. **Rotar tokens y claves** periódicamente

---

**Fecha de revisión:** $(Get-Date -Format "yyyy-MM-dd HH:mm")  
**Estado:** Repositorio limpio y seguro para subir
