# 🎬 CONFIGURACIÓN PARA VIDEO DEMO - 100% REAL

## ❌ Problemas Identificados

1. **Dropbox**: Token necesita renovación
2. **Salesforce**: Credenciales de Connected App inválidas  
3. **Backend**: No está corriendo

## ✅ SOLUCIONES PASO A PASO

### 1. ARREGLAR DROPBOX (5 minutos)

```bash
# Generar nuevo token
cd backend
node dropbox-token-generator.js
```

Copia el nuevo `DROPBOX_ACCESS_TOKEN` al archivo `.env`

### 2. CONFIGURAR SALESFORCE REAL (10 minutos)

#### Paso A: Crear Connected App
1. Ve a tu org de Salesforce
2. Setup → App Manager → New Connected App
3. Configuración:
   ```
   Connected App Name: Forms App Integration
   API Name: Forms_App_Integration
   Contact Email: tu-email@example.com
   ```

#### Paso B: Configurar OAuth
1. ✅ Enable OAuth Settings
2. Callback URL: `https://localhost:3000/oauth/callback`
3. Selected OAuth Scopes:
   - ✅ Access and manage your data (api)
   - ✅ Perform requests on your behalf at any time (refresh_token, offline_access)

#### Paso C: Habilitar Client Credentials
1. ✅ Enable Client Credentials Flow
2. Run As User: Tu usuario (o uno con permisos de API)

#### Paso D: Obtener Credenciales
1. Después de guardar, ve a la Connected App
2. Copia el **Consumer Key** → `SALESFORCE_CLIENT_ID`
3. Click "Click to reveal" para el **Consumer Secret** → `SALESFORCE_CLIENT_SECRET`

#### Paso E: Actualizar .env
```env
SALESFORCE_CLIENT_ID=3MVG9d...tu_consumer_key
SALESFORCE_CLIENT_SECRET=9195...tu_consumer_secret
SALESFORCE_INSTANCE_URL=https://login.salesforce.com
```

### 3. INICIAR BACKEND

```bash
cd backend
npm run dev
```

### 4. VERIFICAR TODO FUNCIONA

```bash
node test-video-ready.js
```

Deberías ver:
```
🎉 ALL INTEGRATIONS ARE REAL AND WORKING!
✅ Ready for video recording
```

## 🎯 RESULTADO FINAL

Cuando todo esté configurado:

- **Dropbox**: ✅ Uploads reales a Dropbox
- **Power Automate**: ✅ JSON files triggering real automation  
- **Salesforce**: ✅ Accounts/Contacts creados en Salesforce real
- **Frontend**: ✅ Showing real URLs to Salesforce records

## 🚀 PARA EL VIDEO

1. Abre frontend: `http://localhost:5173`
2. Prueba integración Salesforce → Verás Account ID real
3. Prueba crear ticket → Se sube a Dropbox real
4. Abre Salesforce → Verás los records creados
5. Abre Dropbox → Verás los archivos JSON

**NO HAY SIMULACIONES - TODO ES 100% FUNCIONAL**

## ⚡ Si no tienes Salesforce Org

Opción 1: Developer Org gratis
1. Ve a https://developer.salesforce.com/signup
2. Crea cuenta gratuita
3. Sigue pasos de Connected App arriba

Opción 2: Remover Salesforce del demo
1. Enfócate en Dropbox/Power Automate (que ya funciona)
2. Muestra el sistema de tickets y formularios

## 🎬 DEMO SCRIPT SUGERIDO

1. **Crear formulario** → Muestra generación dinámica
2. **Llenar formulario** → Datos reales del usuario  
3. **Crear ticket de soporte** → Se sube a Dropbox real
4. **Integración Salesforce** → Account creado con ID real
5. **Mostrar Salesforce** → Abrir URL del record creado
6. **Mostrar Dropbox** → Archivos JSON subidos realmente

¡Todo será 100% funcional para tu video! 🎉
