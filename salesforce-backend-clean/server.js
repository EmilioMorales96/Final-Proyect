// SERVIDOR EXPRESS LIMPIO - SOLO SALESFORCE OAUTH
// ===============================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔧 MIDDLEWARE BÁSICO
app.use(express.json());
app.use(cors({
  origin: '*', // Permitir todos los orígenes para testing
  credentials: true
}));

// 🚨 MIDDLEWARE DE DEBUG - VER TODAS LAS REQUESTS
app.use((req, res, next) => {
  console.log(`🌐 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log(`🔍 Query:`, req.query);
  console.log(`📝 Headers:`, req.headers);
  next();
});

// 🏠 ROOT ENDPOINT
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: '🚀 Salesforce Backend Limpio - Funcionando Correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    purpose: 'Dedicated Salesforce OAuth Backend',
    endpoints: {
      health: 'GET /',
      test: 'GET /test',
      oauth_url: 'GET /oauth/url',
      oauth_callback: 'GET /oauth/callback',
      token_info: 'GET /token/info'
    }
  });
});

// 🧪 TEST ENDPOINT
app.get('/test', (req, res) => {
  const config = {
    client_id_configured: !!process.env.SALESFORCE_CLIENT_ID,
    client_secret_configured: !!process.env.SALESFORCE_CLIENT_SECRET,
    redirect_uri: process.env.SALESFORCE_REDIRECT_URI,
    login_url: process.env.SALESFORCE_LOGIN_URL,
    environment: process.env.NODE_ENV
  };

  res.json({
    status: 'success',
    message: '✅ Test de configuración exitoso',
    timestamp: new Date().toISOString(),
    configuration: config,
    ready: config.client_id_configured && config.client_secret_configured
  });
});

// 🔗 GENERAR URL OAUTH
app.get('/oauth/url', (req, res) => {
  try {
    console.log('🔗 Generando URL OAuth...');

    if (!process.env.SALESFORCE_CLIENT_ID || !process.env.SALESFORCE_CLIENT_SECRET) {
      return res.status(400).json({
        status: 'error',
        message: 'Configuración incompleta: falta CLIENT_ID o CLIENT_SECRET'
      });
    }

    const state = `clean_${Date.now()}`;
    const authUrl = new URL(`${process.env.SALESFORCE_LOGIN_URL}/services/oauth2/authorize`);
    
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', process.env.SALESFORCE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', process.env.SALESFORCE_REDIRECT_URI);
    authUrl.searchParams.set('scope', 'api refresh_token offline_access');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('prompt', 'consent');

    console.log('✅ URL OAuth generada:', authUrl.toString());

    res.json({
      status: 'success',
      message: 'URL OAuth generada correctamente',
      oauth_url: authUrl.toString(),
      state: state,
      instructions: [
        '1. 🔗 Copia y pega la URL en tu navegador',
        '2. 🔐 Inicia sesión en Salesforce',
        '3. ✅ Acepta los permisos solicitados',
        '4. 🔄 Serás redirigido automáticamente al callback'
      ],
      callback_url: process.env.SALESFORCE_REDIRECT_URI
    });

  } catch (error) {
    console.error('❌ Error generando URL OAuth:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno generando URL OAuth',
      error: error.message
    });
  }
});

// 🔄 OAUTH CALLBACK - CORAZÓN DEL SISTEMA
app.get('/oauth/callback', async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;
    
    console.log('🔄 OAUTH CALLBACK RECIBIDO:');
    console.log('  - Code:', code ? 'SÍ ✅' : 'NO ❌');
    console.log('  - State:', state);
    console.log('  - Error:', error);
    console.log('  - Error Description:', error_description);
    console.log('  - Full Query:', JSON.stringify(req.query, null, 2));

    // HTML de respuesta base
    const htmlResponse = (title, content, isSuccess = false) => `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
          .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .success { color: #28a745; }
          .error { color: #dc3545; }
          .warning { color: #ffc107; }
          .info { color: #17a2b8; }
          pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; }
          .btn { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          ${content}
        </div>
      </body>
      </html>
    `;

    // Si hay error OAuth de Salesforce
    if (error) {
      console.error('❌ Error OAuth de Salesforce:', error, error_description);
      
      const errorContent = `
        <h1 class="error">❌ Error OAuth de Salesforce</h1>
        <h2>Error: ${error}</h2>
        <p><strong>Descripción:</strong> ${error_description || 'Sin descripción'}</p>
        
        <h3>🔧 Soluciones Comunes:</h3>
        <ul>
          <li><strong>invalid_client_id:</strong> Verifica el Consumer Key en Salesforce</li>
          <li><strong>invalid_redirect_uri:</strong> Verifica el Callback URL en Connected App</li>
          <li><strong>access_denied:</strong> Usuario canceló la autorización</li>
        </ul>
        
        <h3>📋 Información de Debug:</h3>
        <pre>${JSON.stringify({
          timestamp: new Date().toISOString(),
          oauth_error: error,
          oauth_error_description: error_description,
          state_received: state,
          query_params: req.query
        }, null, 2)}</pre>
        
        <a href="/oauth/url" class="btn">🔄 Generar Nueva URL OAuth</a>
      `;
      
      return res.send(htmlResponse('Error OAuth', errorContent));
    }

    // Si no hay código de autorización
    if (!code) {
      console.log('⚠️ No se recibió código de autorización');
      
      const noCodeContent = `
        <h1 class="warning">⚠️ Sin Código de Autorización</h1>
        <p>No se recibió un código de autorización de Salesforce.</p>
        <p>Esto puede pasar si:</p>
        <ul>
          <li>Accediste directamente a esta URL</li>
          <li>Hubo un problema en el flujo OAuth</li>
          <li>La URL OAuth expiró</li>
        </ul>
        
        <h3>📋 Información Recibida:</h3>
        <pre>${JSON.stringify({
          timestamp: new Date().toISOString(),
          query_params: req.query,
          message: 'No authorization code received'
        }, null, 2)}</pre>
        
        <a href="/oauth/url" class="btn">🔗 Generar URL OAuth</a>
        <a href="/test" class="btn">🧪 Test de Configuración</a>
      `;
      
      return res.send(htmlResponse('Sin Código OAuth', noCodeContent));
    }

    // ✅ PROCESAR CÓDIGO DE AUTORIZACIÓN
    console.log('✅ Código recibido, intercambiando por token...');
    
    const tokenUrl = `${process.env.SALESFORCE_LOGIN_URL}/services/oauth2/token`;
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      redirect_uri: process.env.SALESFORCE_REDIRECT_URI,
      code: code
    });

    console.log('🔗 Llamando a Salesforce para intercambio de token...');
    
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: tokenParams
    });

    const tokenData = await tokenResponse.json();
    
    console.log('📥 Respuesta de Salesforce:', tokenResponse.status, tokenData);

    if (tokenResponse.ok && tokenData.access_token) {
      // 🎉 ÉXITO TOTAL
      console.log('🎉 ¡ÉXITO! Token obtenido correctamente');
      
      const successContent = `
        <h1 class="success">🎉 ¡OAuth Exitoso!</h1>
        <h2>✅ Integración con Salesforce Completada</h2>
        
        <div class="success">
          <h3>🔑 Token de Acceso Obtenido:</h3>
          <p>✅ Access Token: Recibido correctamente</p>
          <p>✅ Instance URL: ${tokenData.instance_url || 'N/A'}</p>
          <p>✅ Token Type: ${tokenData.token_type || 'N/A'}</p>
          <p>✅ Scope: ${tokenData.scope || 'N/A'}</p>
        </div>
        
        <h3>📋 Información Completa:</h3>
        <pre>${JSON.stringify({
          timestamp: new Date().toISOString(),
          status: 'SUCCESS',
          oauth_flow_completed: true,
          access_token_received: true,
          instance_url: tokenData.instance_url,
          token_type: tokenData.token_type,
          scope: tokenData.scope,
          state_original: state
        }, null, 2)}</pre>
        
        <h3>🚀 Próximos Pasos:</h3>
        <ul>
          <li>✅ La integración OAuth está funcionando perfectamente</li>
          <li>🔗 Puedes usar el access token para llamadas a la API de Salesforce</li>
          <li>🔄 El sistema está listo para producción</li>
        </ul>
        
        <a href="/test" class="btn">🧪 Test de Sistema</a>
        <a href="/oauth/url" class="btn">🔄 Nueva Autorización</a>
      `;
      
      return res.send(htmlResponse('OAuth Exitoso', successContent, true));
      
    } else {
      // ❌ Error en intercambio de token
      console.error('❌ Error intercambiando token:', tokenData);
      
      const tokenErrorContent = `
        <h1 class="error">❌ Error en Intercambio de Token</h1>
        <p>Se recibió el código de autorización pero falló el intercambio por token.</p>
        
        <h3>📋 Error de Salesforce:</h3>
        <pre>${JSON.stringify({
          timestamp: new Date().toISOString(),
          http_status: tokenResponse.status,
          salesforce_error: tokenData,
          authorization_code_received: !!code,
          token_exchange_failed: true
        }, null, 2)}</pre>
        
        <h3>🔧 Posibles Causas:</h3>
        <ul>
          <li>Client Secret incorrecto</li>
          <li>Código de autorización expirado</li>
          <li>Configuración incorrecta en Salesforce</li>
        </ul>
        
        <a href="/oauth/url" class="btn">🔄 Intentar de Nuevo</a>
        <a href="/test" class="btn">🧪 Verificar Configuración</a>
      `;
      
      return res.send(htmlResponse('Error Token', tokenErrorContent));
    }

  } catch (error) {
    console.error('❌ Error general en callback:', error);
    
    const generalErrorContent = `
      <h1 class="error">❌ Error Interno del Servidor</h1>
      <p>Ocurrió un error inesperado procesando el callback OAuth.</p>
      
      <h3>📋 Información del Error:</h3>
      <pre>${JSON.stringify({
        timestamp: new Date().toISOString(),
        error_message: error.message,
        error_stack: error.stack,
        query_params: req.query
      }, null, 2)}</pre>
      
      <a href="/oauth/url" class="btn">🔄 Intentar de Nuevo</a>
      <a href="/" class="btn">🏠 Inicio</a>
    `;
    
    return res.status(500).send(htmlResponse('Error Interno', generalErrorContent));
  }
});

// 🔍 TOKEN INFO ENDPOINT
app.get('/token/info', (req, res) => {
  res.json({
    status: 'info',
    message: 'Endpoint para información de tokens (implementar según necesidades)',
    note: 'Aquí se pueden agregar endpoints para manejar tokens almacenados'
  });
});

// 🚫 404 HANDLER
app.use('*', (req, res) => {
  console.log(`❌ Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method,
    available_endpoints: [
      'GET /',
      'GET /test',
      'GET /oauth/url',
      'GET /oauth/callback',
      'GET /token/info'
    ]
  });
});

// 🚀 INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log('🚀 =====================================');
  console.log(`🌟 SALESFORCE BACKEND LIMPIO INICIADO`);
  console.log('🚀 =====================================');
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Iniciado: ${new Date().toISOString()}`);
  console.log('');
  console.log('🔗 ENDPOINTS DISPONIBLES:');
  console.log(`   🏠 Health: http://localhost:${PORT}/`);
  console.log(`   🧪 Test: http://localhost:${PORT}/test`);
  console.log(`   🔗 OAuth URL: http://localhost:${PORT}/oauth/url`);
  console.log(`   🔄 OAuth Callback: http://localhost:${PORT}/oauth/callback`);
  console.log('');
  console.log('✅ Servidor listo para OAuth con Salesforce');
  console.log('🚀 =====================================');
});

export default app;
