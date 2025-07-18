// SERVIDOR OAUTH LIMPIO PARA REEMPLAZAR EL ACTUAL
// ===============================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔧 MIDDLEWARE
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

// 🚨 LOGGING MIDDLEWARE
app.use((req, res, next) => {
  console.log(`🌐 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 🏠 ROOT - SALUD DEL SISTEMA
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: '🚀 Salesforce OAuth Backend - LIMPIO Y FUNCIONAL',
    timestamp: new Date().toISOString(),
    version: '2.0.0-clean',
    purpose: 'Dedicated Salesforce OAuth without frontend interference',
    endpoints: {
      health: 'GET /',
      test: 'GET /test',
      oauth_url: 'GET /oauth/url',
      oauth_callback: 'GET /oauth/callback',
      oauth_callback_alt: 'GET /auth/callback'
    },
    notes: [
      'Este backend está dedicado exclusivamente a OAuth con Salesforce',
      'No hay interferencias de frontend o archivos estáticos',
      'Todas las rutas OAuth funcionan correctamente'
    ]
  });
});

// 🧪 TEST ENDPOINT
app.get('/test', (req, res) => {
  const config = {
    client_id_configured: !!process.env.SALESFORCE_CLIENT_ID,
    client_secret_configured: !!process.env.SALESFORCE_CLIENT_SECRET,
    redirect_uri: process.env.SALESFORCE_REDIRECT_URI || 'https://backend-service-pu47.onrender.com/oauth/callback',
    login_url: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com',
    environment: process.env.NODE_ENV || 'production'
  };

  res.json({
    status: 'success',
    message: '✅ Configuración OAuth verificada',
    timestamp: new Date().toISOString(),
    configuration: config,
    ready: config.client_id_configured && config.client_secret_configured,
    system: 'Clean OAuth Backend v2.0'
  });
});

// 🔗 GENERAR URL OAUTH
app.get('/oauth/url', (req, res) => {
  try {
    if (!process.env.SALESFORCE_CLIENT_ID) {
      return res.status(400).json({
        status: 'error',
        message: 'CLIENT_ID no configurado'
      });
    }

    const redirectUri = process.env.SALESFORCE_REDIRECT_URI || 'https://backend-service-pu47.onrender.com/oauth/callback';
    const loginUrl = process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';
    const state = `clean_v2_${Date.now()}`;
    
    const authUrl = new URL(`${loginUrl}/services/oauth2/authorize`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', process.env.SALESFORCE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'api refresh_token offline_access');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('prompt', 'consent');

    console.log('✅ URL OAuth generada:', authUrl.toString());

    res.json({
      status: 'success',
      message: 'URL OAuth generada - Backend Limpio v2.0',
      oauth_url: authUrl.toString(),
      state: state,
      callback_url: redirectUri,
      instructions: [
        '🔗 COPIA esta URL en tu navegador',
        '🔐 Inicia sesión en Salesforce',
        '✅ Acepta los permisos',
        '🔄 Serás redirigido automáticamente'
      ],
      important: 'Este backend está libre de interferencias frontend'
    });

  } catch (error) {
    console.error('❌ Error generando OAuth URL:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generando URL OAuth',
      error: error.message
    });
  }
});

// 🔄 OAUTH CALLBACK PRINCIPAL
app.get('/oauth/callback', async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;
    
    console.log('🔄 OAUTH CALLBACK - CLEAN v2.0:');
    console.log('  Code:', code ? 'YES ✅' : 'NO ❌');
    console.log('  State:', state);
    console.log('  Error:', error);
    console.log('  Query:', JSON.stringify(req.query, null, 2));

    // Base HTML response
    const createHtmlResponse = (title, content, type = 'info') => {
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
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #333; }
            .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
            .header { text-align: center; margin-bottom: 30px; }
            .status { color: ${colors[type] || colors.info}; font-size: 1.2em; font-weight: bold; }
            pre { background: #f8f9fa; padding: 20px; border-radius: 8px; overflow-x: auto; border-left: 4px solid ${colors[type] || colors.info}; }
            .btn { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; margin: 10px 5px; transition: background 0.3s; }
            .btn:hover { background: #0056b3; }
            .success-icon { font-size: 4em; color: #28a745; text-align: center; margin: 20px 0; }
            .error-icon { font-size: 4em; color: #dc3545; text-align: center; margin: 20px 0; }
            ul { padding-left: 20px; }
            li { margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Salesforce OAuth Backend v2.0</h1>
              <p class="status">${title}</p>
            </div>
            ${content}
          </div>
        </body>
        </html>
      `;
    };

    // Error OAuth de Salesforce
    if (error) {
      console.error('❌ Error OAuth:', error, error_description);
      
      const errorContent = `
        <div class="error-icon">❌</div>
        <h2>Error OAuth de Salesforce</h2>
        <h3>Error: ${error}</h3>
        <p><strong>Descripción:</strong> ${error_description || 'Sin descripción disponible'}</p>
        
        <h3>🔧 Soluciones Comunes:</h3>
        <ul>
          <li><strong>invalid_client_id:</strong> Verificar Consumer Key en Salesforce Connected App</li>
          <li><strong>invalid_redirect_uri:</strong> Verificar Callback URL exacto en Connected App</li>
          <li><strong>access_denied:</strong> Usuario canceló la autorización</li>
          <li><strong>invalid_request:</strong> Parámetros incorrectos en la solicitud</li>
        </ul>
        
        <h3>📋 Debug Information:</h3>
        <pre>${JSON.stringify({
          timestamp: new Date().toISOString(),
          backend_version: '2.0.0-clean',
          oauth_error: error,
          oauth_error_description: error_description,
          state_received: state,
          full_query: req.query
        }, null, 2)}</pre>
        
        <a href="/oauth/url" class="btn">🔄 Generar Nueva URL OAuth</a>
        <a href="/test" class="btn">🧪 Verificar Configuración</a>
      `;
      
      return res.send(createHtmlResponse('Error OAuth Detectado', errorContent, 'error'));
    }

    // Sin código de autorización
    if (!code) {
      console.log('⚠️ Sin código de autorización');
      
      const noCodeContent = `
        <div class="error-icon">⚠️</div>
        <h2>Sin Código de Autorización</h2>
        <p>No se recibió código de autorización de Salesforce. Esto puede ocurrir si:</p>
        <ul>
          <li>Accediste directamente a esta URL</li>
          <li>La autorización falló o fue cancelada</li>
          <li>Hubo un problema en el flujo OAuth</li>
        </ul>
        
        <h3>📋 Información Recibida:</h3>
        <pre>${JSON.stringify({
          timestamp: new Date().toISOString(),
          backend_version: '2.0.0-clean',
          query_params: req.query,
          expected: 'authorization code from Salesforce'
        }, null, 2)}</pre>
        
        <a href="/oauth/url" class="btn">🔗 Generar URL OAuth</a>
        <a href="/test" class="btn">🧪 Test de Sistema</a>
      `;
      
      return res.send(createHtmlResponse('Sin Código OAuth', noCodeContent, 'warning'));
    }

    // ✅ PROCESAR CÓDIGO - INTERCAMBIO POR TOKEN
    console.log('✅ Código recibido, intercambiando por access token...');
    
    const tokenUrl = `${process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com'}/services/oauth2/token`;
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      redirect_uri: process.env.SALESFORCE_REDIRECT_URI || 'https://backend-service-pu47.onrender.com/oauth/callback',
      code: code
    });

    console.log('🔗 Calling Salesforce token endpoint...');
    
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: tokenParams
    });

    const tokenData = await tokenResponse.json();
    
    console.log('📥 Token Response:', tokenResponse.status, tokenData);

    if (tokenResponse.ok && tokenData.access_token) {
      // 🎉 ÉXITO COMPLETO
      console.log('🎉 ¡ÉXITO TOTAL! OAuth completado exitosamente');
      
      const successContent = `
        <div class="success-icon">🎉</div>
        <h2>¡OAuth Exitoso!</h2>
        <h3>✅ Integración con Salesforce Completada</h3>
        
        <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h4>🔑 Información del Token:</h4>
          <p>✅ <strong>Access Token:</strong> Obtenido correctamente</p>
          <p>✅ <strong>Instance URL:</strong> ${tokenData.instance_url}</p>
          <p>✅ <strong>Token Type:</strong> ${tokenData.token_type}</p>
          <p>✅ <strong>Scope:</strong> ${tokenData.scope}</p>
          ${tokenData.refresh_token ? '<p>✅ <strong>Refresh Token:</strong> Disponible</p>' : ''}
        </div>
        
        <h3>📋 Detalles de la Integración:</h3>
        <pre>${JSON.stringify({
          timestamp: new Date().toISOString(),
          backend_version: '2.0.0-clean',
          status: 'SUCCESS',
          oauth_flow_completed: true,
          access_token_obtained: true,
          instance_url: tokenData.instance_url,
          token_type: tokenData.token_type,
          scope: tokenData.scope,
          has_refresh_token: !!tokenData.refresh_token,
          state_original: state
        }, null, 2)}</pre>
        
        <h3>🚀 ¡Sistema Listo!</h3>
        <ul>
          <li>✅ OAuth flow completado exitosamente</li>
          <li>🔗 Access token disponible para API calls</li>
          <li>🎯 Integración lista para producción</li>
          <li>🛡️ Backend libre de interferencias frontend</li>
        </ul>
        
        <a href="/test" class="btn">🧪 Test de Sistema</a>
        <a href="/oauth/url" class="btn">🔄 Nueva Autorización</a>
      `;
      
      return res.send(createHtmlResponse('OAuth Completado Exitosamente', successContent, 'success'));
      
    } else {
      // ❌ Error en token exchange
      console.error('❌ Error en intercambio de token:', tokenData);
      
      const tokenErrorContent = `
        <div class="error-icon">❌</div>
        <h2>Error en Intercambio de Token</h2>
        <p>Se recibió el código de autorización correctamente, pero falló el intercambio por access token.</p>
        
        <h3>📋 Respuesta de Salesforce:</h3>
        <pre>${JSON.stringify({
          timestamp: new Date().toISOString(),
          backend_version: '2.0.0-clean',
          http_status: tokenResponse.status,
          authorization_code_received: true,
          token_exchange_failed: true,
          salesforce_response: tokenData
        }, null, 2)}</pre>
        
        <h3>🔧 Posibles Causas:</h3>
        <ul>
          <li>Client Secret incorrecto o expirado</li>
          <li>Código de autorización ya usado o expirado</li>
          <li>Configuración incorrecta en Salesforce Connected App</li>
          <li>Redirect URI no coincide exactamente</li>
        </ul>
        
        <a href="/oauth/url" class="btn">🔄 Intentar Nuevamente</a>
        <a href="/test" class="btn">🧪 Verificar Config</a>
      `;
      
      return res.send(createHtmlResponse('Error en Token Exchange', tokenErrorContent, 'error'));
    }

  } catch (error) {
    console.error('❌ Error general en callback:', error);
    
    const generalErrorContent = `
      <div class="error-icon">💥</div>
      <h2>Error Interno del Servidor</h2>
      <p>Ocurrió un error inesperado procesando el callback OAuth.</p>
      
      <h3>📋 Información del Error:</h3>
      <pre>${JSON.stringify({
        timestamp: new Date().toISOString(),
        backend_version: '2.0.0-clean',
        error_message: error.message,
        query_params: req.query
      }, null, 2)}</pre>
      
      <a href="/oauth/url" class="btn">🔄 Reintentar OAuth</a>
      <a href="/" class="btn">🏠 Inicio</a>
    `;
    
    return res.status(500).send(createHtmlResponse('Error Interno', generalErrorContent, 'error'));
  }
});

// 🔄 CALLBACK ALTERNATIVO (por compatibilidad)
app.get('/auth/callback', (req, res) => {
  console.log('🔄 Redirecting from alternative callback to main callback');
  const queryString = new URLSearchParams(req.query).toString();
  res.redirect(`/oauth/callback?${queryString}`);
});

// 🚫 404 HANDLER
app.use('*', (req, res) => {
  console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    status: 'error',
    message: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method,
    backend_version: '2.0.0-clean',
    available_endpoints: [
      'GET /',
      'GET /test',
      'GET /oauth/url',
      'GET /oauth/callback',
      'GET /auth/callback'
    ]
  });
});

// 🚀 START SERVER
app.listen(PORT, () => {
  console.log(`
🚀 ==========================================
   SALESFORCE OAUTH BACKEND v2.0 - CLEAN
🚀 ==========================================

📡 Puerto: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
⏰ Iniciado: ${new Date().toISOString()}

🔗 ENDPOINTS:
   🏠 Health: http://localhost:${PORT}/
   🧪 Test: http://localhost:${PORT}/test
   🔗 OAuth URL: http://localhost:${PORT}/oauth/url
   🔄 OAuth Callback: http://localhost:${PORT}/oauth/callback
   🔄 Alt Callback: http://localhost:${PORT}/auth/callback

✅ Backend limpio - Sin interferencias frontend
🎯 Listo para OAuth con Salesforce
🚀 ==========================================
  `);
});

export default app;
