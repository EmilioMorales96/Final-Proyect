# Backend 403 Forbidden Error Resolution

## 🚨 **Current Issues**

**Backend URL**: https://backend-service-pu47.onrender.com
**Status**: All API endpoints returning 403 Forbidden

**Affected Endpoints**:
- `GET /api/templates` → 403 Forbidden
- `GET /api/favorites` → 403 Forbidden  
- `GET /api/users/me/status` → 403 Forbidden

## 🔍 **Root Cause Analysis**

403 Forbidden indicates **authentication/authorization failure**, not network issues:

1. **CORS Configuration**: Backend may not accept frontend domain
2. **JWT Middleware**: Token validation might be failing
3. **Route Protection**: Authentication middleware blocking requests
4. **Environment Variables**: Missing production configuration

## 🛠️ **Immediate Solutions**

### **Solution 1: Test Backend Connectivity**

Primero verificar si el backend está funcionando:
```bash
curl https://backend-service-pu47.onrender.com/health
```

### **Solution 2: Middleware Conflict Analysis** 🔍

**Probable causa**: Conflicto en los middlewares de autenticación que está causando que el token JWT no se valide correctamente en producción.

#### **Problemas Comunes de Middleware:**
1. **Orden de middleware incorrecto** - auth middleware ejecutándose antes que CORS
2. **Headers malformados** - Authorization header no llegando correctamente
3. **JWT Secret diferente** - Variable de entorno JWT_SECRET no configurada en Render
4. **Token parsing** - Middleware no extrayendo el token correctamente

### **Solution 3: Debug Authentication Flow**

#### **Paso 1: Verificar configuración de middleware**
```javascript
// En backend, verificar orden correcto:
app.use(cors())  // CORS primero
app.use(express.json())  // Body parser segundo
app.use('/api/users', authMiddleware, userRoutes)  // Auth middleware después
```

#### **Paso 2: Agregar logs de debugging**
```javascript
// En auth.middleware.js
const authMiddleware = (req, res, next) => {
  console.log('🔍 Auth middleware - Headers:', req.headers);
  console.log('🔍 Authorization header:', req.headers.authorization);
  
  const token = req.headers.authorization?.split(' ')[1];
  console.log('🔍 Extracted token:', token ? 'EXISTS' : 'MISSING');
  
  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // ...resto del middleware
};
```

### **Solution 4: Environment Variables Check**

Verificar que en Render estén configuradas:
- `JWT_SECRET` - Debe ser igual al del desarrollo
- `NODE_ENV=production`
- `DATABASE_URL` - Configuración de base de datos
- `CORS_ORIGIN` - Dominio del frontend

### **Solution 5: CORS Configuration**

```javascript
// En backend app.js o server.js
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'https://tu-frontend-domain.com'  // Agregar dominio de producción
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

## 🚀 **Solución Rápida - Frontend Resiliente**

Mientras arreglamos el backend, hagamos el frontend más resistente a errores:

### **Paso 1: Mejorar manejo de errores en useUserStatusMonitor**

```javascript
// frontend/src/hooks/useUserStatusMonitor.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkUserStatus } from '../features/userSlice';

export function useUserStatusMonitor() {
  const dispatch = useDispatch();
  const { userId, isBlocked } = useSelector((state) => state.user);

  useEffect(() => {
    const interval = setInterval(() => {
      if (userId) {
        dispatch(checkUserStatus(userId));
      }
    }, 5000); // Verificar cada 5 segundos

    return () => clearInterval(interval);
  }, [dispatch, userId]);

  if (isBlocked) {
    // Manejo específico si el usuario está bloqueado
    console.warn('Usuario está bloqueado');
  }
}
```

## 🎯 **Solución Implementada**

### **Problema Identificado: Middleware Conflict** ✅

**Causa raíz**: El middleware `auth.middleware.js` bloquea usuarios con `isBlocked: true` devolviendo 403 Forbidden, pero el endpoint `/api/users/me/status` necesita poder responder con el estado de bloqueo.

**Resultado**: Círculo vicioso donde usuarios bloqueados no pueden saber que están bloqueados.

### **Solución Aplicada**

#### **1. Nuevo Middleware Especializado** 🔧
- **Archivo**: `auth-status.middleware.js`
- **Función**: Permite acceso a usuarios bloqueados solo para verificar su estado
- **Diferencia**: NO devuelve 403 para usuarios bloqueados

#### **2. Ruta Actualizada** 📡
- **Endpoint**: `GET /api/users/me/status`
- **Middleware**: Cambiado de `authenticateToken` a `authenticateTokenForStatus`
- **Respuesta**: Incluye `isBlocked` y `userId`

#### **3. Frontend Mejorado** 💪
- **Manejo de 403**: Distingue entre bloqueo de usuario y errores de servidor
- **Logging detallado**: Para mejor debugging en producción
- **Resiliencia**: No desconecta usuarios por errores temporales

## 🚀 **Pasos para Desplegar la Solución**

### **Paso 1: Verificar Cambios Localmente**
```bash
cd backend
npm start
```

Verificar que el endpoint funciona:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/users/me/status
```

### **Paso 2: Desplegar a Render**
1. Commitear los cambios:
```bash
git add .
git commit -m "fix: resolve 403 middleware conflict for user status endpoint"
git push origin main
```

2. Render automáticamente redesplegará el backend

### **Paso 3: Verificar Variables de Entorno en Render**
Asegurar que están configuradas:
- `JWT_SECRET` ✅
- `DATABASE_URL` ✅  
- `NODE_ENV=production` ✅
- `CORS_ORIGIN` (dominio del frontend) ✅

### **Paso 4: Probar en Producción**
Después del despliegue, verificar:
```bash
curl -H "Authorization: Bearer VALID_TOKEN" https://backend-service-pu47.onrender.com/api/users/me/status
```

## 📋 **Archivos Modificados**

1. **`backend/middleware/auth-status.middleware.js`** - NUEVO
   - Middleware especializado para endpoint de estado
   - Permite acceso a usuarios bloqueados

2. **`backend/routes/user.routes.js`** - MODIFICADO
   - Import del nuevo middleware
   - Cambio de middleware en ruta `/me/status`
   - Logging mejorado

3. **`frontend/src/hooks/useUserStatusMonitor.js`** - MEJORADO
   - Manejo específico de errores 403
   - Logging detallado para debugging
   - Mayor resiliencia a errores temporales

## ✅ **Resultado Esperado**

Después del despliegue:
- ✅ `/api/users/me/status` debe responder 200 OK
- ✅ Usuarios bloqueados reciben su estado correctamente
- ✅ Sistema de bloqueo en tiempo real funcional
- ✅ No más errores 403 en este endpoint

## 🔍 **Debugging en Producción**

Si persisten problemas, verificar logs de Render para:
- Mensajes de consola del middleware
- Errores de JWT validation
- Problemas de CORS o variables de entorno
