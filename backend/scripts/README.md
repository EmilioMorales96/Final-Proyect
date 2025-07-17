# Backend Scripts

Esta carpeta contiene scripts de utilidad, testing y versiones alternativas del servidor para desarrollo y depuración.

## 📁 Contenido

### 🧪 Scripts de Testing
- `test-auth.js` - Pruebas de autenticación
- `test-form.js` - Pruebas de formularios
- `test-likes.js` - Pruebas del sistema de likes
- `test-main.js` - Pruebas principales
- `test-minimal.js` - Pruebas básicas
- `test-models.js` - Pruebas de modelos de base de datos
- `test-server.js` - Pruebas del servidor
- `test-template.js` - Pruebas de templates

### 🔧 Versiones Alternativas del Servidor
- `server-clean.js` - Versión limpia del servidor
- `server-debug.js` - Versión con debug habilitado
- `server-fixed.js` - Versión con correcciones específicas

### 📱 Versiones Alternativas de la Aplicación
- `app-clean.js` - Versión limpia de la aplicación
- `app-debug.js` - Versión con debug
- `app-fixed.js` - Versión con correcciones
- `app-minimal.js` - Versión minimalista

### 🚀 Servidores Especiales
- `minimal-server.js` - Servidor mínimo para pruebas rápidas

## 🏃‍♂️ Uso

Para ejecutar cualquier script desde la carpeta raíz del backend:

```bash
# Ejecutar un test específico
node scripts/test-auth.js

# Ejecutar servidor alternativo
node scripts/server-debug.js

# Ejecutar versión mínima
node scripts/minimal-server.js
```

## 📝 Notas

- Los archivos principales del servidor están en la raíz: `server.js` y `app.js`
- Estos scripts son para desarrollo, testing y depuración
- No modificar sin entender su propósito específico
