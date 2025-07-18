# PROYECTO LIMPIO - BACKEND PURO SALESFORCE
# ==========================================

## 🎯 OBJETIVO
Crear un backend completamente separado del frontend que maneje SOLO Salesforce OAuth sin interferencias.

## 📁 ESTRUCTURA PROPUESTA
```
salesforce-backend-clean/
├── package.json              # Solo dependencias backend
├── server.js                 # Servidor Express puro
├── .env                      # Variables de entorno
├── routes/
│   └── salesforce.js         # Solo rutas Salesforce
└── middleware/
    └── cors.js               # CORS configurado para frontend
```

## 🔧 VENTAJAS
- ✅ Sin conflictos con archivos estáticos del frontend
- ✅ OAuth callbacks funcionan perfectamente
- ✅ Deploy independiente en Render
- ✅ Debugging más fácil
- ✅ Escalabilidad futura

## 🚀 PASOS
1. Crear nuevo repositorio backend-only
2. Deploy separado en Render
3. Frontend apunta al nuevo backend
4. OAuth funciona sin interferencias

## 🔗 URLs FINALES
- Backend: https://salesforce-backend-clean.onrender.com
- Frontend: https://forms-frontend.onrender.com (existente)
- OAuth Callback: https://salesforce-backend-clean.onrender.com/oauth/callback
```
