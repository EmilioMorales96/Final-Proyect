# 🔐 CONFIGURACIÓN SEGURA DE CREDENCIALES

## ⚠️ IMPORTANTE: SEGURIDAD DE CREDENCIALES

Este documento explica cómo configurar las credenciales de manera segura para las integraciones del proyecto.

## 📋 Variables de Entorno Requeridas

### 1. Dropbox (Power Automate Integration)
```bash
DROPBOX_APP_KEY=your_app_key_from_dropbox_console
DROPBOX_APP_SECRET=your_app_secret_from_dropbox_console  
DROPBOX_ACCESS_TOKEN=your_generated_access_token
```

**Cómo obtener:**
1. Ve a https://www.dropbox.com/developers/apps
2. Crea una nueva app "Scoped App"
3. Copia App Key y App Secret
4. Genera un Access Token en la consola

### 2. Salesforce Integration
```bash
SALESFORCE_CLIENT_ID=your_connected_app_client_id
SALESFORCE_CLIENT_SECRET=your_connected_app_client_secret
SALESFORCE_INSTANCE_URL=https://your-domain.salesforce.com
```

**Cómo obtener:**
1. Ve a https://developer.salesforce.com y crea Developer Org
2. Setup → App Manager → New Connected App
3. Habilita OAuth Settings
4. Copia Consumer Key (Client ID) y Consumer Secret

### 3. Base de Datos
```bash
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

## 🚀 Configuración en Render.com

### Para Despliegue en Producción:
1. Ve a tu dashboard de Render
2. Selecciona tu servicio
3. Environment → Add Environment Variable
4. Agrega cada variable una por una

### Variables Críticas para Render:
```bash
NODE_ENV=production
DATABASE_URL=[proporcionado automáticamente por Neon]
DROPBOX_ACCESS_TOKEN=[tu token de Dropbox]
SALESFORCE_CLIENT_ID=[tu client ID de Salesforce]
SALESFORCE_CLIENT_SECRET=[tu client secret de Salesforce]
SALESFORCE_INSTANCE_URL=[tu URL de instancia de Salesforce]
JWT_SECRET=[una clave secreta fuerte]
```

## 🔒 Mejores Prácticas de Seguridad

### ✅ QUÉ HACER:
- Usar .env para desarrollo local
- Configurar variables en Render dashboard para producción
- Rotar tokens periódicamente
- Usar diferentes credenciales para desarrollo y producción
- Verificar que .env está en .gitignore

### ❌ QUÉ NO HACER:
- Nunca subir .env al repositorio
- Nunca hardcodear credenciales en el código
- Nunca compartir tokens en chat/email
- Nunca usar las mismas credenciales en múltiples proyectos

## 🧪 Testing de Integraciones

### Dropbox Test:
```bash
# Test connection endpoint (requiere autenticación)
curl -X GET "http://localhost:3000/api/support/test-connection" \
  -H "Authorization: Bearer your_jwt_token"
```

### Salesforce Test:
```bash
# Create account endpoint  
curl -X POST "http://localhost:3000/api/salesforce/create-account" \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"companyName":"Test Company","industry":"Technology"}'
```

## 📞 Soporte

Si tienes problemas con las credenciales:
1. Verifica que todas las variables estén configuradas
2. Revisa los logs del servidor para errores específicos
3. Confirma que los tokens no hayan expirado
4. Verifica que las URLs de redirect estén configuradas correctamente

---
**Nota:** Este archivo contiene información general sobre configuración. Las credenciales reales deben configurarse según las instrucciones específicas de cada servicio.
