// 🚀 SERVIDOR OAUTH SIMPLE PARA PRESENTACIÓN
// ==========================================
// Solo OAuth, sin complicaciones

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
    message: '🚀 Salesforce OAuth - PRESENTACIÓN',
    version: '5.0-simple',
    endpoints: ['/', '/test', '/oauth/url', '/oauth/callback'],
    timestamp: new Date().toISOString(),
    status: 'LISTO PARA PRESENTACIÓN'
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
    presentation_ready: !!(process.env.SALESFORCE_CLIENT_ID && process.env.SALESFORCE_CLIENT_SECRET)
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
  const state = `presentation_${Date.now()}`;
  
  const authUrl = new URL('https://login.salesforce.com/services/oauth2/authorize');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', process.env.SALESFORCE_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'api refresh_token offline_access');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('prompt', 'consent');

  res.json({
    status: 'success',
    message: '🔗 URL OAuth generada para presentación',
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
  
  console.log('🔄 CALLBACK RECIBIDO:', { 
    code: code ? 'SÍ ✅' : 'NO ❌', 
    error: error || 'NO', 
    state 
  });

  // Template HTML para respuestas
  const html = (title, content, type = 'info') => {
    const colors = {
      success: '#28a745',
      error: '#dc3545', 
      warning: '#ffc107',
      info: '#17a2b8'
    };
    
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            margin: 0; 
            padding: 40px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: #333; 
          }
          .container { 
            max-width: 900px; 
            margin: 0 auto; 
            background: white; 
            padding: 40px; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.2); 
          }
          .header { text-align: center; margin-bottom: 30px; }
          .${type} { color: ${colors[type]}; font-size: 1.1em; font-weight: bold; }
          pre { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            overflow-x: auto; 
            border-left: 4px solid ${colors[type]}; 
          }
          .btn { 
            display: inline-block; 
            padding: 12px 24px; 
            background: #007bff; 
            color: white; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 10px 5px; 
            transition: background 0.3s; 
          }
          .btn:hover { background: #0056b3; }
          .icon { font-size: 4em; text-align: center; margin: 20px 0; }
          ul { padding-left: 20px; }
          li { margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Salesforce OAuth - Presentación</h1>
            <p class="${type}">${title}</p>
          </div>
          ${content}
        </div>
      </body>
      </html>
    `;
  };

  // ❌ ERROR OAUTH
  if (error) {
    console.error('❌ ERROR OAUTH:', error, error_description);
    
    return res.send(html('Error OAuth Detectado', `
      <div class="icon error">❌</div>
      <h2>Error: ${error}</h2>
      <p><strong>Descripción:</strong> ${error_description || 'Sin descripción'}</p>
      
      <h3>🔧 Soluciones Comunes:</h3>
      <ul>
        <li><strong>invalid_client_id:</strong> Verificar Consumer Key en Salesforce</li>
        <li><strong>invalid_redirect_uri:</strong> Verificar Callback URL en Connected App</li>
        <li><strong>access_denied:</strong> Usuario canceló autorización</li>
      </ul>
      
      <h3>📋 Debug Info:</h3>
      <pre>${JSON.stringify({
        timestamp: new Date().toISOString(),
        oauth_error: error,
        description: error_description,
        state,
        presentation_mode: true
      }, null, 2)}</pre>
      
      <a href="/oauth/url" class="btn">🔄 Generar Nueva URL</a>
      <a href="/test" class="btn">🧪 Verificar Config</a>
    `, 'error'));
  }

  // ⚠️ SIN CÓDIGO
  if (!code) {
    console.log('⚠️ SIN CÓDIGO DE AUTORIZACIÓN');
    
    return res.send(html('Sin Código de Autorización', `
      <div class="icon warning">⚠️</div>
      <h2>No se recibió código de autorización</h2>
      <p>Esto ocurre cuando accedes directamente a esta URL o la autorización falló.</p>
      
      <h3>✅ Para presentación correcta:</h3>
      <ol>
        <li>Ir a <code>/oauth/url</code></li>
        <li>Copiar la URL generada</li>
        <li>Abrirla en el navegador</li>
        <li>Completar autorización en Salesforce</li>
      </ol>
      
      <h3>📋 Info Recibida:</h3>
      <pre>${JSON.stringify({
        timestamp: new Date().toISOString(),
        query_params: req.query,
        presentation_mode: true
      }, null, 2)}</pre>
      
      <a href="/oauth/url" class="btn">🔗 Generar URL OAuth</a>
      <a href="/test" class="btn">🧪 Test Sistema</a>
    `, 'warning'));
  }

  // ✅ PROCESAR CÓDIGO
  console.log('✅ CÓDIGO RECIBIDO - Intercambiando por token...');
  
  try {
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      redirect_uri: 'https://backend-service-pu47.onrender.com/oauth/callback',
      code
    });

    console.log('🔗 Llamando a Salesforce token endpoint...');

    const response = await fetch('https://login.salesforce.com/services/oauth2/token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: tokenParams
    });

    const data = await response.json();
    
    console.log('📥 RESPUESTA DE TOKEN:', response.status, data);

    if (response.ok && data.access_token) {
      // 🎉 ÉXITO COMPLETO
      console.log('🎉 ¡ÉXITO TOTAL! OAuth completado para presentación');
      
      return res.send(html('🎉 ¡Presentación Exitosa!', `
        <div class="icon success">🎉</div>
        <h2>¡OAuth Completado Exitosamente!</h2>
        
        <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h3>✅ Integración Salesforce Funcionando</h3>
          <p>🔑 <strong>Access Token:</strong> Obtenido correctamente</p>
          <p>🌐 <strong>Instance URL:</strong> ${data.instance_url}</p>
          <p>📊 <strong>Scope:</strong> ${data.scope}</p>
          <p>🔄 <strong>Refresh Token:</strong> ${data.refresh_token ? 'Disponible' : 'N/A'}</p>
        </div>
        
        <h3>🚀 Estado de la Presentación:</h3>
        <ul>
          <li>✅ OAuth flow completado</li>
          <li>✅ Access token obtenido</li>
          <li>✅ Integración lista para usar</li>
          <li>✅ Sistema funcionando correctamente</li>
        </ul>
        
        <h3>📋 Detalles Técnicos:</h3>
        <pre>${JSON.stringify({
          timestamp: new Date().toISOString(),
          status: 'PRESENTATION_SUCCESS',
          oauth_completed: true,
          access_token_obtained: true,
          instance_url: data.instance_url,
          scope: data.scope,
          state_original: state
        }, null, 2)}</pre>
        
        <h3>🎯 ¡Sistema Listo para Producción!</h3>
        
        <a href="/test" class="btn">🧪 Test Sistema</a>
        <a href="/oauth/url" class="btn">🔄 Nueva Demo</a>
      `, 'success'));
      
    } else {
      // ❌ ERROR EN TOKEN
      console.error('❌ ERROR EN INTERCAMBIO DE TOKEN:', data);
      
      return res.send(html('Error en Token Exchange', `
        <div class="icon error">❌</div>
        <h2>Error obteniendo Access Token</h2>
        <p>El código de autorización se recibió correctamente, pero falló el intercambio por token.</p>
        
        <h3>📋 Respuesta de Salesforce:</h3>
        <pre>${JSON.stringify({
          timestamp: new Date().toISOString(),
          http_status: response.status,
          authorization_code_received: true,
          token_exchange_failed: true,
          salesforce_response: data
        }, null, 2)}</pre>
        
        <a href="/oauth/url" class="btn">🔄 Intentar Nuevamente</a>
        <a href="/test" class="btn">🧪 Verificar Config</a>
      `, 'error'));
    }

  } catch (fetchError) {
    console.error('❌ ERROR DE RED:', fetchError);
    
    return res.status(500).send(html('Error de Red', `
      <div class="icon error">💥</div>
      <h2>Error de conectividad</h2>
      <p>No se pudo conectar con Salesforce para intercambiar el token.</p>
      
      <h3>📋 Error Info:</h3>
      <pre>${JSON.stringify({
        timestamp: new Date().toISOString(),
        error_message: fetchError.message,
        error_type: 'NETWORK_ERROR'
      }, null, 2)}</pre>
      
      <a href="/oauth/url" class="btn">🔄 Reintentar</a>
    `, 'error'));
  }
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    path: req.originalUrl,
    available_endpoints: ['/', '/test', '/oauth/url', '/oauth/callback'],
    presentation_ready: true
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
🚀 ================================================
   SALESFORCE OAUTH - LISTO PARA PRESENTACIÓN
🚀 ================================================

📡 Puerto: ${PORT}
⏰ Iniciado: ${new Date().toISOString()}

🔗 ENDPOINTS PARA DEMO:
   🏠 Status: http://localhost:${PORT}/
   🧪 Test: http://localhost:${PORT}/test
   🔗 OAuth URL: http://localhost:${PORT}/oauth/url
   🔄 Callback: http://localhost:${PORT}/oauth/callback

✅ SISTEMA SIMPLE Y FUNCIONAL
🎯 PERFECTO PARA PRESENTACIÓN
🚀 ================================================
  `);
});
