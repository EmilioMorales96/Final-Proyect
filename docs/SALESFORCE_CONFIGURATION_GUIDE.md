# Configuración de Salesforce Integration - Guía Completa

## ❌ Problema Identificado
Las credenciales actuales de Salesforce no son válidas. Error: `invalid_client_id`

## ✅ Solución: Configurar Connected App en Salesforce

### Paso 1: Crear Connected App en Salesforce

1. **Ir a Setup**
   - Inicia sesión en tu org de Salesforce
   - Busca "App Manager" en Quick Find
   - Click en "New Connected App"

2. **Configuración Básica**
   ```
   Connected App Name: Forms App Integration
   API Name: Forms_App_Integration
   Contact Email: tu-email@example.com
   Description: Integración para Forms App - Creación de Accounts y Contacts
   ```

3. **API (Enable OAuth Settings)**
   - ✅ Enable OAuth Settings
   - Callback URL: `https://tu-dominio.com/api/salesforce/oauth/callback`
   - Selected OAuth Scopes:
     - ✅ Access and manage your data (api)
     - ✅ Perform requests on your behalf at any time (refresh_token, offline_access)
     - ✅ Access your basic information (id, profile, email, address, phone)

4. **Client Credentials Flow**
   - ✅ Enable Client Credentials Flow
   - Run As User: Seleccionar un usuario con permisos para crear Accounts/Contacts

### Paso 2: Obtener las Credenciales Correctas

Después de crear la Connected App:

1. **Consumer Key (Client ID)**
   - Ve a la Connected App creada
   - Copia el "Consumer Key"

2. **Consumer Secret (Client Secret)**
   - Click en "Click to reveal" para ver el Consumer Secret
   - Copia el valor

### Paso 3: Actualizar el archivo .env

```env
# Salesforce Integration
SALESFORCE_CLIENT_ID=TU_CONSUMER_KEY_AQUI
SALESFORCE_CLIENT_SECRET=TU_CONSUMER_SECRET_AQUI
SALESFORCE_INSTANCE_URL=https://login.salesforce.com
```

### Paso 4: Configurar Permisos

El usuario "Run As" debe tener estos permisos:
- ✅ Create/Edit Accounts
- ✅ Create/Edit Contacts
- ✅ API Access
- ✅ Modify All Data (recomendado para testing)

### Paso 5: Verificar la Configuración

Ejecuta el test de integración:
```bash
cd backend
node test-salesforce-real.js
```

## 🔧 Configuración Alternativa (Si no tienes Salesforce Org)

Si no tienes acceso a una org de Salesforce, puedes:

1. **Crear Developer Org gratuita**
   - Ve a https://developer.salesforce.com/signup
   - Crea una cuenta gratuita de developer

2. **O usar simulación mejorada**
   - Modifica la integración para usar solo modo simulado
   - Mantén la estructura de respuesta realista

## ❗ Notas Importantes

- **Client Credentials Flow** es necesario para integraciones server-to-server
- Las credenciales actuales en el .env no son válidas
- Una vez configurado correctamente, la integración será 100% funcional
- El sistema actual tiene fallback a simulación si falla la integración real

## 🎯 Estado Actual

- ✅ Dropbox Integration: 100% funcional
- ✅ Power Automate: 100% funcional  
- ❌ Salesforce Integration: Credenciales inválidas (necesita configuración)
- ✅ Frontend: Usando endpoints públicos para demo

## 📋 Next Steps

1. Configurar Connected App en Salesforce
2. Actualizar credenciales en .env
3. Ejecutar test de verificación
4. Probar integración desde frontend
5. ¡Listo para video de demostración!
