# 🔧 Guía Visual: Configuración de Salesforce OAuth

## ❌ **Problema Actual**
```
error=invalid_client_id&error_description=client%20identifier%20invalid
```

Este error indica que el `client_id` no es válido o no está configurado correctamente en Salesforce.

## 🎯 **Pasos para Solucionar**

### **1. Verificar Connected App en Salesforce**

#### **Paso 1.1: Acceder a App Manager**
1. Ve a **Setup** en Salesforce
2. En Quick Find, busca: `App Manager`
3. Haz clic en **App Manager**

#### **Paso 1.2: Encontrar tu Connected App**
- Busca una app llamada algo como:
  - "Forms Integration"
  - "Forms App"
  - O el nombre que le hayas puesto

#### **Paso 1.3: Verificar OAuth Settings**
1. Haz clic en la **flecha hacia abajo** (▼) junto a tu app
2. Selecciona **"Edit"**
3. Busca la sección **"OAuth Settings"**

### **2. Configuración Correcta de OAuth**

#### **✅ Debe estar marcado:**
- ☑️ **Enable OAuth Settings**
- ☑️ **Require Secret for Web Server Flow** 

#### **📋 Callback URL debe ser exactamente:**
```
https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback
```

#### **🔑 Selected OAuth Scopes debe incluir:**
- **Access and manage your data (api)**
- **Perform requests on your behalf at any time (refresh_token)**

### **3. Obtener el CLIENT_ID Correcto**

#### **Paso 3.1: Ir a "Manage Connected Apps"**
1. En App Manager, haz clic en **"Manage"** en tu app
2. O ve a Setup → Apps → Connected Apps → Manage Connected Apps

#### **Paso 3.2: Copiar Consumer Key**
- El **Consumer Key** es tu `SALESFORCE_CLIENT_ID`
- Cópialo exactamente como aparece (sin espacios)

#### **Paso 3.3: Copiar Consumer Secret**
- Haz clic en **"Click to reveal"** en Consumer Secret
- Copia el **Consumer Secret** completo

## 🔍 **Verificación de Variables en Render**

### **Configuración Actual en Render:**
```bash
SALESFORCE_CLIENT_ID=[TU_CLIENT_ID_ANTERIOR]
SALESFORCE_CLIENT_SECRET=[TU_CLIENT_SECRET_ANTERIOR]
SALESFORCE_REDIRECT_URI=https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback
FRONTEND_URL=https://frontend-9ajm.onrender.com
```

### **🚨 Acción Requerida:**
1. **Compara** el `Consumer Key` de Salesforce con `SALESFORCE_CLIENT_ID` en Render
2. **Si son diferentes**, actualiza en Render con el valor correcto
3. **Haz Manual Deploy** después de cambiar las variables

## 🛠️ **Diagnóstico Paso a Paso**

### **Paso 1: Verificar Configuración del Servidor**
Ve a: https://backend-service-pu47.onrender.com/api/salesforce/debug/config

**Debe mostrar:**
```json
{
  "environment": "production",
  "salesforce": {
    "clientId": "SET",
    "clientSecret": "SET",
    "redirectUri": "SET",
    "instanceUrl": "SET",
    "frontendUrl": "SET"
  }
}
```

### **Paso 2: Probar OAuth Directo**
Ve a: https://backend-service-pu47.onrender.com/api/salesforce/oauth/authorize

**Debe redirigir a Salesforce sin errores**

## 🔧 **Soluciones Comunes**

### **Si el CLIENT_ID está mal:**
1. Ve a Salesforce → Setup → App Manager
2. Encuentra tu Connected App
3. Haz clic en "View" o "Manage"
4. Copia el **Consumer Key** exacto
5. Reemplaza `SALESFORCE_CLIENT_ID` en Render
6. Haz Manual Deploy

### **Si no tienes Connected App:**
1. Ve a Setup → Apps → App Manager
2. Haz clic en **"New Connected App"**
3. Completa:
   - **Connected App Name:** Forms Integration
   - **API Name:** Forms_Integration
   - **Contact Email:** tu email
4. En OAuth Settings:
   - ☑️ Enable OAuth Settings
   - **Callback URL:** `https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback`
   - **Selected OAuth Scopes:** api, refresh_token
5. Guarda y espera 2-10 minutos
6. Copia Consumer Key y Consumer Secret a Render

---

**💡 El problema más común es que el Consumer Key en Salesforce no coincide exactamente con el CLIENT_ID en Render.**

---

## 🆕 **CREANDO NUEVA CONNECTED APP DESDE CERO**

### **🎯 Paso 1: Crear Nueva Connected App**

1. **Ve a Setup en Salesforce**
   - Haz clic en el ⚙️ (Setup) en la esquina superior derecha

2. **Buscar App Manager**
   - En el Quick Find (búsqueda rápida), escribe: `App Manager`
   - Haz clic en **"App Manager"**

3. **Crear Nueva App**
   - Haz clic en **"New Connected App"** (botón azul)

### **📋 Paso 2: Configuración Básica**

#### **Connected App Information:**
```
Connected App Name: Forms Integration App
API Name: Forms_Integration_App
Contact Email: [TU_EMAIL_AQUÍ]
Description: OAuth integration for Forms application
```

## 🎯 **CONFIGURACIÓN EXACTA PARA TU PANTALLA ACTUAL**

### **📝 Completa los campos así:**

#### **1. Nombre de aplicación cliente externa:**
```
Forms Integration App
```

#### **2. Nombre de la API:**
```
Forms_Integration_App
```
*(Se auto-completa, pero verifica que sea correcto)*

#### **3. Email de contacto:**
```
sergioemilio85@gmail.com
```
*(Tu email que ya tienes puesto está bien)*

#### **4. Estado de distribución:**
```
Local
```
*(Déjalo como está - es correcto)*

#### **5. URL de información:**
```
(Déjalo vacío - no es obligatorio)
```

#### **6. Teléfono de contacto:**
```
(Déjalo vacío - no es obligatorio)
```

#### **7. URL de imagen de logotipo:**
```
(Déjalo vacío - no es obligatorio)
```

#### **8. URL de icono:**
```
(Déjalo vacío - no es obligatorio)
```

#### **9. Seleccione uno de nuestros logotipos de muestra:**
```
(No selecciones nada - déjalo vacío)
```

#### **10. Descripción:**
```
OAuth integration for Forms application to sync data with Salesforce CRM
```

### **⬇️ SIGUIENTE PASO IMPORTANTE:**

**Después de completar estos campos, debes hacer SCROLL HACIA ABAJO** para encontrar:

#### **🔑 Web App Settings (API - Enable OAuth Settings)**
**¡ESTA ES LA PARTE MÁS IMPORTANTE!**

Busca una sección que diga:
- **"API (Enable OAuth Settings)"** 
- O **"Web App Settings"**
- O **"Enable OAuth Settings"**

**☑️ MARCA LA CASILLA** que dice **"Enable OAuth Settings"**

Una vez que marques esa casilla, aparecerán **más campos de OAuth** donde configurarás:
- Callback URL
- OAuth Scopes  
- Otros settings de OAuth

### **📲 ¿No ves la sección OAuth?**

Si no aparece la sección de OAuth después de hacer scroll:
1. **Verifica** que tengas permisos de administrador
2. **Revisa** que estés en la página correcta (New Connected App)
3. **Busca** una casilla que diga "Enable OAuth Settings" y márcala

---

## 🎯 **CONFIGURACIÓN EXACTA PARA LA PANTALLA QUE TIENES**

### **🔧 Configuración de aplicación**

#### **1. URL de devolución de llamada:**
```
https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback
```
*(Ya lo tienes correcto - ✅)*

### **🔑 Ámbitos de OAuth**

#### **2. Ámbitos de OAuth seleccionados:**
**Mueve estos elementos** de "Disponibles" a "Seleccionados" usando las flechas:

**✅ DEBE ESTAR EN SELECCIONADOS:**
- **Gestionar datos de usuario** (api)
- **Acceso completo** (full)

**Para moverlos:**
1. Haz clic en **"Gestionar datos de usuario"** en la lista izquierda
2. Haz clic en la **flecha →** para moverlo a la derecha
3. Haz clic en **"Acceso completo"** en la lista izquierda  
4. Haz clic en la **flecha →** para moverlo a la derecha

### **⚙️ Activación de flujos**

#### **3. NO marques ninguna casilla en "Activación de flujos":**
- ☐ Activar flujo de credenciales de cliente (NO)
- ☐ Activar flujo Código de autorización y de credenciales (NO)
- ☐ Activar flujo de dispositivo (NO)
- ☐ Activar flujo del portador de JWT (NO)
- ☐ Activar flujo de intercambio de tokens (NO)

### **🔒 Seguridad**

#### **4. MARCA estas casillas en "Seguridad":**
- ☑️ **Requerir secreto para flujo de servidor web** ✅
- ☑️ **Requerir secreto para flujo de token de actualización** ✅  
- ☑️ **Extensión Requerir clave de prueba para intercambio de código (PKCE)** ✅

#### **5. NO marques estas:**
- ☐ Habilitar rotación de tokens de actualización (NO)
- ☐ Emitir tokens de acceso basados en tokens web JSON (JWT) (NO)

---

## 💾 **DESPUÉS DE CONFIGURAR TODO:**

1. **Revisa** que tengas:
   - URL callback correcta ✅
   - "Gestionar datos de usuario" y "Acceso completo" en seleccionados
   - Las 3 casillas de seguridad marcadas
   - Ninguna casilla de "Activación de flujos" marcada

2. **Haz clic en "GUARDAR"**

3. **⏰ ESPERA 10 MINUTOS** antes de usar las credenciales

4. **Después**, ve a App Manager → tu app → "View" para copiar:
   - Consumer Key (CLIENT_ID)
   - Consumer Secret (CLIENT_SECRET)

### **🔧 Paso 5: Configurar en Render**

**Reemplaza en Render Environment Variables:**

```bash
SALESFORCE_CLIENT_ID=[PEGAR_CONSUMER_KEY_AQUÍ]
SALESFORCE_CLIENT_SECRET=[PEGAR_CONSUMER_SECRET_AQUÍ]
SALESFORCE_REDIRECT_URI=https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback
SALESFORCE_INSTANCE_URL=https://login.salesforce.com
FRONTEND_URL=https://frontend-9ajm.onrender.com
```

### **🚀 Paso 6: Deploy y Probar**

1. **Manual Deploy** en Render
2. **Espera 2-3 minutos**
3. **Verifica configuración:** https://backend-service-pu47.onrender.com/api/salesforce/debug/config
4. **Prueba OAuth:** https://backend-service-pu47.onrender.com/api/salesforce/oauth/authorize

### **✅ Paso 7: Verificación Final**

**El debug config debe mostrar:**
```json
{
  "environment": "production",
  "salesforce": {
    "clientId": "SET",
    "clientSecret": "SET",
    "redirectUri": "SET",
    "instanceUrl": "SET",
    "frontendUrl": "SET"
  }
}
```

**El OAuth debe redirigir a Salesforce sin errores**

---

## 🚨 **IMPORTANTE - TIEMPOS DE ESPERA**

- **Después de crear la app:** Espera 10 minutos
- **Después de cambiar variables en Render:** Espera 3 minutos (deploy)
- **No pruebes inmediatamente** - Salesforce necesita tiempo para propagar

---

## 🆘 **Si Sigues Teniendo Problemas**

### **Opción 1: Usar Sandbox/Developer Org**
- Crea una Developer Edition gratis en https://developer.salesforce.com/signup
- Crea la Connected App ahí
- Usa esas credenciales

### **Opción 2: Verificar Permisos**
- Asegúrate de tener permisos de System Administrator
- O pide ayuda a alguien con esos permisos

---

## 📞 **Checklist Pre-Creación**

Antes de crear la nueva app, confirma:

- [ ] ✅ Tengo acceso de administrador en Salesforce
- [ ] ✅ Estoy en la org correcta (no en sandbox por error)
- [ ] ✅ Tengo las URLs exactas para callback
- [ ] ✅ Voy a esperar 10 minutos después de crear
- [ ] ✅ Voy a copiar las credenciales exactas (sin espacios)

---

## 🎯 **CONFIGURACIÓN EXACTA CON LAS NUEVAS CREDENCIALES**

### **🔑 Credenciales Obtenidas de Salesforce:**

```bash
Consumer Key (CLIENT_ID): [TU_CONSUMER_KEY_AQUÍ]

Consumer Secret (CLIENT_SECRET): [TU_CONSUMER_SECRET_AQUÍ]
```

### **🔧 CONFIGURAR EN RENDER AHORA:**

**Ve a tu Backend Service en Render y reemplaza estas variables:**

```bash
SALESFORCE_CLIENT_ID=[TU_CONSUMER_KEY_AQUÍ]

SALESFORCE_CLIENT_SECRET=[TU_CONSUMER_SECRET_AQUÍ]

SALESFORCE_REDIRECT_URI=https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback

SALESFORCE_INSTANCE_URL=https://login.salesforce.com

FRONTEND_URL=https://frontend-9ajm.onrender.com
```

### **🚀 PASOS INMEDIATOS:**

1. **Ir a Render Dashboard** → Backend Service
2. **Environment** → **Edit** las variables arriba
3. **Save Changes**
4. **Manual Deploy** → **Deploy Latest Commit**
5. **Esperar 3 minutos** que termine el deploy

### **🧪 PROBAR DESPUÉS DEL DEPLOY:**

#### **1. Verificar configuración:**
```
https://backend-service-pu47.onrender.com/api/salesforce/debug/config
```
**Debe mostrar todas las variables como "SET"**

#### **2. Probar OAuth directo:**
```
https://backend-service-pu47.onrender.com/api/salesforce/oauth/authorize
```
**Debe redirigir a Salesforce SIN errores**

#### **3. Probar desde el frontend:**
- Ve a: `https://frontend-9ajm.onrender.com/admin/integrations`
- Haz clic en **"Conectar con Salesforce"**
- **Debería funcionar sin errores de client_id**

---

## ✅ **SI TODO FUNCIONA:**

¡Habrás resuelto completamente el problema de OAuth! 🎊

El error `invalid_client_id` desaparecerá y podrás:
- ✅ Conectar con Salesforce via OAuth
- ✅ Crear cuentas y contactos desde tu app
- ✅ Sincronizar datos entre tu aplicación y Salesforce

---

## 🕐 **CRONOGRAMA:**

- **Ahora:** Configurar variables en Render
- **En 3 minutos:** Deploy terminado
- **En 3-5 minutos:** Probar OAuth funcional

¿Ya estás configurando las variables en Render?
