// SERVIDOR DE TESTING SIMPLE - OAUTH SALESFORCE
// ============================================

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001; // Puerto diferente para evitar conflictos

// Middleware
app.use(express.json());
app.use(cors());

// Configuración Salesforce (hardcodeada para testing inmediato)
const SALESFORCE_CONFIG = {
  CLIENT_ID: '3MVG9dAEux2v1sLvdOrUdraM5cuNowe2zhCqrlOC02H0rB.4KFSDOmAukpIiSLkO.PRW3WMyN71AgmlIGR_2j',
  REDIRECT_URI: 'https://backend-service-pu47.onrender.com/oauth/callback',
  LOGIN_URL: 'https://login.salesforce.com'
};

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: '✅ FUNCIONANDO',
    message: 'Backend de Testing OAuth Salesforce',
    timestamp: new Date().toISOString(),
    endpoints: {
      test: 'GET /test',
      oauth_url: 'GET /oauth/url',
      oauth_callback: 'GET /oauth/callback'
    }
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({
    status: 'success',
    message: '✅ Configuración verificada',
    config: {
      client_id_present: !!SALESFORCE_CONFIG.CLIENT_ID,
      redirect_uri: SALESFORCE_CONFIG.REDIRECT_URI,
      login_url: SALESFORCE_CONFIG.LOGIN_URL
    },
    ready: true
  });
});

// Generar URL OAuth
app.get('/oauth/url', (req, res) => {
  const state = `test_${Date.now()}`;
  const authUrl = new URL(`${SALESFORCE_CONFIG.LOGIN_URL}/services/oauth2/authorize`);
  
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', SALESFORCE_CONFIG.CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', SALESFORCE_CONFIG.REDIRECT_URI);
  authUrl.searchParams.set('scope', 'api refresh_token offline_access');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('prompt', 'consent');

  res.json({
    status: 'success',
    oauth_url: authUrl.toString(),
    state: state,
    message: '🔗 URL OAuth generada - Copia y pega en tu navegador'
  });
});

// OAuth Callback
app.get('/oauth/callback', (req, res) => {
  const { code, state, error } = req.query;
  
  console.log('📥 CALLBACK RECIBIDO:', { code: !!code, state, error });
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head><title>OAuth Callback - Testing</title></head>
    <body style="font-family: Arial; margin: 40px;">
      <h1>🔄 OAuth Callback - Testing</h1>
      <h2>Status: ${code ? '✅ CÓDIGO RECIBIDO' : error ? '❌ ERROR' : '⚠️ SIN CÓDIGO'}</h2>
      
      <h3>📋 Información Recibida:</h3>
      <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
${JSON.stringify({
  timestamp: new Date().toISOString(),
  code_received: !!code,
  state_received: state,
  error_received: error,
  query_params: req.query
}, null, 2)}
      </pre>
      
      <h3>🎯 Resultado:</h3>
      ${code ? 
        '<p style="color: green;"><strong>✅ ÉXITO: Código OAuth recibido correctamente!</strong></p>' :
        error ? 
        '<p style="color: red;"><strong>❌ ERROR OAuth: ' + error + '</strong></p>' :
        '<p style="color: orange;"><strong>⚠️ No se recibió código de autorización</strong></p>'
      }
      
      <a href="/oauth/url" style="display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">🔄 Generar Nueva URL</a>
    </body>
    </html>
  `;
  
  res.send(html);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
🚀 ========================================
   SERVIDOR DE TESTING OAUTH INICIADO
🚀 ========================================

📡 Puerto: ${PORT}
🌍 Local: http://localhost:${PORT}
⏰ Iniciado: ${new Date().toISOString()}

🔗 ENDPOINTS PARA TESTING:
   🏠 Status: http://localhost:${PORT}/
   🧪 Test: http://localhost:${PORT}/test  
   🔗 OAuth URL: http://localhost:${PORT}/oauth/url
   🔄 Callback: http://localhost:${PORT}/oauth/callback

✅ Listo para testing OAuth con Salesforce
🚀 ========================================
  `);
});

export default app;
