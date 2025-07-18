# SALESFORCE BACKEND LIMPIO
## Backend dedicado exclusivamente a OAuth con Salesforce

### 🎯 PROPÓSITO
Backend minimalista y limpio diseñado específicamente para manejar el flujo OAuth de Salesforce sin interferencias de frontend o complejidades adicionales.

### 🏗️ ARQUITECTURA
- **Express.js puro**: Sin base de datos, sin autenticación compleja
- **Solo OAuth**: Enfocado únicamente en Salesforce OAuth 2.0
- **Debugging completo**: Logs detallados y respuestas HTML informativas
- **Sin conflictos**: No hay archivos estáticos ni frontend que interfiera

### 🔧 ENDPOINTS

| Endpoint | Método | Descripción |
|----------|---------|-------------|
| `/` | GET | Health check y información del sistema |
| `/test` | GET | Verificar configuración de Salesforce |
| `/oauth/url` | GET | Generar URL de autorización OAuth |
| `/oauth/callback` | GET | Procesar callback OAuth y obtener tokens |
| `/token/info` | GET | Información sobre tokens (extensible) |

### 🚀 CONFIGURACIÓN

1. **Variables de entorno** (`.env`):
   ```
   SALESFORCE_CLIENT_ID=tu_consumer_key
   SALESFORCE_CLIENT_SECRET=tu_client_secret
   SALESFORCE_REDIRECT_URI=https://tu-backend.com/oauth/callback
   SALESFORCE_LOGIN_URL=https://login.salesforce.com
   ```

2. **Instalación**:
   ```bash
   npm install
   npm start
   ```

### 🔄 FLUJO OAUTH

1. **Generar URL**: `GET /oauth/url`
2. **Usuario autoriza**: Redirige a Salesforce
3. **Callback procesado**: `GET /oauth/callback`
4. **Token obtenido**: Sistema completamente funcional

### ✅ VENTAJAS

- ✅ Sin interferencias de frontend
- ✅ Debugging completo con HTML visual
- ✅ Logs detallados en consola
- ✅ Manejo de errores exhaustivo
- ✅ Listo para deploy en Render
- ✅ Arquitectura limpia y escalable

### 🎯 IDEAL PARA

- Presentaciones en vivo
- Testing de OAuth sin complicaciones
- Integración rápida con Salesforce
- Base para sistemas más complejos
