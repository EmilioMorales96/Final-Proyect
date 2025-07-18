// CONFIGURACIÓN PARA SEPARAR FRONTEND Y BACKEND EN EL MISMO SERVICIO
// ====================================================================

// 1. Modificar app.js para que las rutas API tengan ABSOLUTA PRIORIDAD
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 🔥 MIDDLEWARE EN ORDEN ESTRICTO - API PRIMERO
app.use(express.json());
app.use(cors());

// 🎯 RUTAS API PRIMERO - ANTES QUE CUALQUIER ARCHIVO ESTÁTICO
import salesforceRoutes from './routes/salesforce-clean.routes.js';

// Rutas básicas de health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API is running', 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    note: 'Frontend-Backend separation working correctly'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    frontend_backend_separation: 'active'
  });
});

// Salesforce routes
app.use('/api/salesforce', salesforceRoutes);

// 🚧 MIDDLEWARE DE DEBUG PARA CAPTURAR TODAS LAS REQUESTS
app.use((req, res, next) => {
  console.log(`🔍 REQUEST: ${req.method} ${req.path}`);
  console.log(`🔍 URL COMPLETA: ${req.url}`);
  next();
});

// 📁 ARCHIVOS ESTÁTICOS AL FINAL - SOLO SI NO MATCHEA API
app.use(express.static('public'));

// 🎯 CATCH-ALL PARA FRONTEND - SOLO SI NO ES API
app.get('*', (req, res) => {
  // Si la ruta empieza con /api, devolver 404
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ 
      error: 'API route not found',
      path: req.path 
    });
  }
  
  // Para todo lo demás, servir el frontend
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

export default app;
