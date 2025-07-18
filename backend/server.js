// 🚀 SERVIDOR OAUTH SIMPLE - SIN DEPENDENCIAS COMPLEJAS
// ======================================================
// Solo OAuth, sin importar app.js para evitar errores RegExp

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 🏠 HOME
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Salesforce OAuth - PRESENTACIÓN FINAL',
    version: '6.0-final',
    endpoints: ['/', '/test', '/oauth/url', '/oauth/callback'],
    timestamp: new Date().toISOString(),
    status: 'FUNCIONANDO SIN ERRORES REGEXP'
  });
});

// 🧪 TEST
app.get('/test', (req, res) => {
  res.json({
    status: 'success',
    ready: !!(process.env.SALESFORCE_CLIENT_ID && process.env.SALESFORCE_CLIENT_SECRET),
    config: {
      client_id: !!process.env.SALESFORCE_CLIENT_ID ? 'CONFIGURADO ✅' : 'FALTANTE ❌',
      client_secret: !!process.env.SALESFORCE_CLIENT_SECRET ? 'CONFIGURADO ✅' : 'FALTANTE ❌'
    },
    presentation_ready: !!(process.env.SALESFORCE_CLIENT_ID && process.env.SALESFORCE_CLIENT_SECRET),
    no_regexp_errors: true
  });
});

// 🔗 GENERAR OAUTH URL
app.get('/oauth/url', (req, res) => {
  if (!process.env.SALESFORCE_CLIENT_ID) {
    return res.status(400).json({ 
      error: 'CLIENT_ID no configurado',
      action: 'Verificar variables de entorno'
    });
  }

  const redirectUri = 'https://backend-service-pu47.onrender.com/oauth/callback';
  const state = `final_${Date.now()}`;
  
  const authUrl = new URL('https://login.salesforce.com/services/oauth2/authorize');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', process.env.SALESFORCE_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'api refresh_token offline_access');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('prompt', 'consent');

  res.json({
    status: 'success',
    message: '🔗 URL OAuth generada - SIN ERRORES REGEXP',
    oauth_url: authUrl.toString(),
    state,
    instructions: [
      '1. 📋 COPIA la oauth_url',
      '2. 🌐 PÉGALA en tu navegador',
      '3. 🔐 INICIA SESIÓN en Salesforce',
      '4. ✅ ACEPTA los permisos',
      '5. 🎉 VERÁS confirmación de éxito'
    ]
  });
});

// 🔄 OAUTH CALLBACK
app.get('/oauth/callback', async (req, res) => {
  const { code, error, error_description, state } = req.query;
  
  console.log('🔄 CALLBACK:', { 
    code: code ? 'SÍ ✅' : 'NO ❌', 
    error: error || 'NO', 
    state 
  });

  // Template HTML simple
  const html = (title, content, type = 'info') => {
    const colors = { success: '#28a745', error: '#dc3545', warning: '#ffc107', info: '#17a2b8' };
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
          .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
          .${type} { color: ${colors[type]}; font-weight: bold; }
          pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; }
          .btn { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
          .icon { font-size: 3em; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 OAuth Salesforce - Final</h1>
          ${content}
        </div>
      </body>
      </html>
    `;
  };

  // ❌ ERROR OAUTH
  if (error) {
    return res.send(html('Error OAuth', `
      <div class="icon error">❌</div>
      <h2 class="error">Error: ${error}</h2>
      <p><strong>Descripción:</strong> ${error_description || 'Sin descripción'}</p>
      <h3>📋 Debug Info:</h3>
      <pre>${JSON.stringify({ error, error_description, state, timestamp: new Date().toISOString() }, null, 2)}</pre>
      <a href="/oauth/url" class="btn">🔄 Generar Nueva URL</a>
    `, 'error'));
  }

  // ⚠️ SIN CÓDIGO
  if (!code) {
    return res.send(html('Sin Código', `
      <div class="icon warning">⚠️</div>
      <h2 class="warning">Sin código de autorización</h2>
      <p>Accede primero a <code>/oauth/url</code> para generar la URL de autorización.</p>
      <a href="/oauth/url" class="btn">🔗 Generar URL OAuth</a>
    `, 'warning'));
  }

  // ✅ PROCESAR CÓDIGO
  try {
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      redirect_uri: 'https://backend-service-pu47.onrender.com/oauth/callback',
      code
    });

    const response = await fetch('https://login.salesforce.com/services/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams
    });

    const data = await response.json();

    if (response.ok && data.access_token) {
      return res.send(html('¡Éxito!', `
        <div class="icon success">🎉</div>
        <h2 class="success">¡OAuth Completado Exitosamente!</h2>
        <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>✅ Integración Funcionando</h3>
          <p>🔑 <strong>Access Token:</strong> Obtenido ✅</p>
          <p>🌐 <strong>Instance URL:</strong> ${data.instance_url}</p>
          <p>� <strong>Scope:</strong> ${data.scope}</p>
        </div>
        <h3>🚀 Estado Final:</h3>
        <ul>
          <li>✅ OAuth flow completado</li>
          <li>✅ Sin errores RegExp</li>
          <li>✅ Sistema funcionando</li>
          <li>✅ Listo para presentación</li>
        </ul>
        <pre>${JSON.stringify({ status: 'SUCCESS', instance_url: data.instance_url, timestamp: new Date().toISOString() }, null, 2)}</pre>
        <a href="/test" class="btn">🧪 Test Sistema</a>
      `, 'success'));
    } else {
      return res.send(html('Error Token', `
        <div class="icon error">❌</div>
        <h2 class="error">Error obteniendo token</h2>
        <pre>${JSON.stringify(data, null, 2)}</pre>
        <a href="/oauth/url" class="btn">🔄 Reintentar</a>
      `, 'error'));
    }
  } catch (fetchError) {
    return res.send(html('Error Red', `
      <div class="icon error">💥</div>
      <h2 class="error">Error de conectividad: ${fetchError.message}</h2>
      <a href="/oauth/url" class="btn">🔄 Reintentar</a>
    `, 'error'));
  }
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    path: req.originalUrl,
    available: ['/', '/test', '/oauth/url', '/oauth/callback']
  });
});

// Iniciar
app.listen(PORT, () => {
  console.log(`
🚀 =============================================
   OAUTH SALESFORCE - VERSIÓN FINAL LIMPIA
🚀 =============================================

📡 Puerto: ${PORT}
⏰ Iniciado: ${new Date().toISOString()}

🔗 ENDPOINTS:
   🏠 Status: http://localhost:${PORT}/
   🧪 Test: http://localhost:${PORT}/test
   🔗 OAuth: http://localhost:${PORT}/oauth/url
   🔄 Callback: http://localhost:${PORT}/oauth/callback

✅ SIN ERRORES REGEXP
✅ LISTO PARA PRESENTACIÓN
🚀 =============================================
  `);
});
