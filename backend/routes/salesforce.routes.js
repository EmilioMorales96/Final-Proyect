import express from 'express';
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

// 🎯 SALESFORCE INTEGRATION - CLEAN VERSION
// ====================
/**
 * 🔄 OAUTH CALLBACK - ENHANCED DEBUG
 * GET /api/salesforce/oauth/callback
 * Manejar callback de autorización OAuth con debugging mejorado
 */
router.get('/oauth/callback', async (req, res) => {
  // TODO: Implement OAuth callback logic here
  res.send('OAuth callback endpoint');
});

/**
 * 🧪 PUBLIC TEST ENDPOINT
 * GET /api/salesforce/test
 * Test público para verificar configuración
 */
router.get('/test', async (req, res) => {
  try {
    console.log('🧪 [Public Test] Checking configuration...');
    
    const config = {
      client_id_configured: !!process.env.SALESFORCE_CLIENT_ID,
      client_secret_configured: !!process.env.SALESFORCE_CLIENT_SECRET,
      redirect_uri: process.env.SALESFORCE_REDIRECT_URI || 'DEFAULT',
      is_sandbox: process.env.SALESFORCE_IS_SANDBOX || 'false',
      login_url: process.env.SALESFORCE_LOGIN_URL || 'DEFAULT',
      environment: process.env.NODE_ENV || 'development'
    };
    
    res.json({
      status: 'success',
      message: 'Clean Salesforce System - Public Test',
      timestamp: new Date().toISOString(),
      configuration: config,
      ready: config.client_id_configured && config.client_secret_configured,
      endpoints: {
        status: 'GET /api/salesforce/status (requires auth)',
        oauth_url: 'GET /api/salesforce/oauth/url (requires auth)',
        oauth_callback: 'GET /api/salesforce/oauth/callback (public)',
        accounts: 'GET /api/salesforce/accounts (requires auth)',
        create_account: 'POST /api/salesforce/accounts (requires auth)',
        debug: 'GET /api/salesforce/debug (requires auth)',
        test: 'GET /api/salesforce/test (public)'
      }
    });
    
  } catch (error) {
    console.error('❌ Public test error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error in public test',
      error: error.message
    });
  }
});

/**
 * 📊 STATUS ENDPOINT
 * GET /api/salesforce/status
 * Verificar estado de configuración
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    console.log('📊 [Salesforce Status] User:', req.user.id);
    
    const config = {
      client_id: process.env.SALESFORCE_CLIENT_ID ? 'CONFIGURED ✅' : 'MISSING ❌',
      client_secret: process.env.SALESFORCE_CLIENT_SECRET ? 'CONFIGURED ✅' : 'MISSING ❌',
      redirect_uri: process.env.SALESFORCE_REDIRECT_URI || 'https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback',
      is_sandbox: process.env.SALESFORCE_IS_SANDBOX || 'false',
      login_url: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com'
    };
    
    res.json({
      status: 'success',
      message: 'Salesforce configuration status',
      user: req.user.id,
      configuration: config,
      ready_for_oauth: !!(process.env.SALESFORCE_CLIENT_ID && process.env.SALESFORCE_CLIENT_SECRET)
    });
    
  } catch (error) {
    console.error('❌ Status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error getting Salesforce status',
      error: error.message
    });
  }
});

/**
 * 🔗 GENERATE OAUTH URL
 * GET /api/salesforce/oauth/url
 * Generar URL de autorización OAuth
 */
router.get('/oauth/url', authenticateToken, async (req, res) => {
  try {
    console.log('🔗 [OAuth URL] Generating for user:', req.user.id);
    
    // Verificar configuración
    if (!process.env.SALESFORCE_CLIENT_ID || !process.env.SALESFORCE_CLIENT_SECRET) {
      return res.status(400).json({
        status: 'error',
        message: 'Salesforce not configured. Missing CLIENT_ID or CLIENT_SECRET.'
      });
    }
    
    const redirectUri = process.env.SALESFORCE_REDIRECT_URI || 'https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback';
    const loginUrl = process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';
    
    // Construir URL OAuth
    const authUrl = new URL(`${loginUrl}/services/oauth2/authorize`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', process.env.SALESFORCE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'api refresh_token offline_access');
    authUrl.searchParams.set('state', `user_${req.user.id}_${Date.now()}`);
    authUrl.searchParams.set('prompt', 'consent');
    
    console.log('✅ OAuth URL generated successfully');
    
    res.json({
      status: 'success',
      message: 'OAuth URL generated',
      oauth_url: authUrl.toString(),
      instructions: [
        '1. Clic en la URL para autorizar',
        '2. Iniciar sesión en Salesforce',
        '3. Aceptar permisos',
        '4. Serás redirigido automáticamente'
      ],
      configuration: {
        client_id: process.env.SALESFORCE_CLIENT_ID.substring(0, 20) + '...',
        redirect_uri: redirectUri,
        login_url: loginUrl
      }
    });
    
  } catch (error) {
    console.error('❌ OAuth URL generation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating OAuth URL',
      error: error.message
    });
  }
});

/**
 * 🔗 GENERATE OAUTH URL - PUBLIC VERSION
 * GET /api/salesforce/oauth-url-public
 * Generar URL de autorización OAuth (versión pública para testing)
 */
router.get('/oauth-url-public', async (req, res) => {
  try {
    console.log('🔗 [OAuth URL Public] Generating...');
    
    // Verificar configuración
    if (!process.env.SALESFORCE_CLIENT_ID || !process.env.SALESFORCE_CLIENT_SECRET) {
      return res.status(400).json({
        status: 'error',
        message: 'Salesforce not configured. Missing CLIENT_ID or CLIENT_SECRET.'
      });
    }
    
    const redirectUri = process.env.SALESFORCE_REDIRECT_URI || 'https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback';
    const loginUrl = process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';
    
    // Construir URL OAuth
    const authUrl = new URL(`${loginUrl}/services/oauth2/authorize`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', process.env.SALESFORCE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'api refresh_token offline_access');
    authUrl.searchParams.set('state', `clean_test_${Date.now()}`);
    authUrl.searchParams.set('prompt', 'consent');
    
    console.log('✅ OAuth URL generated successfully (PUBLIC)');
    
    res.json({
      status: 'success',
      message: 'OAuth URL generated - Clean System',
      oauth_url: authUrl.toString(),
      instructions: [
        '🔗 COPY Y PEGA LA URL EN TU NAVEGADOR',
        '1. Clic en la URL para autorizar',
        '2. Iniciar sesión en Salesforce',
        '3. Aceptar permisos',
        '4. Serás redirigido automáticamente'
      ],
      configuration: {
        client_id: process.env.SALESFORCE_CLIENT_ID.substring(0, 20) + '...',
        redirect_uri: redirectUri,
        login_url: loginUrl
      },
      important_note: 'ASEGÚRATE de que en tu Salesforce Connected App el Callback URL sea EXACTAMENTE: ' + redirectUri
    });
    
  } catch (error) {
    console.error('❌ OAuth URL generation error (PUBLIC):', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating OAuth URL',
      error: error.message
    });
  }
});

/**
 * 🔄 OAUTH CALLBACK - ENHANCED DEBUG VERSION
 * GET /api/salesforce/oauth/callback
 * Manejar callback de autorización OAuth con debugging mejorado
 */
router.get('/oauth/callback', async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;
    
    console.log('🔄 [OAuth Callback] DETAILED DEBUG:');
    console.log('  - Full URL:', req.url);
    console.log('  - Query Params:', JSON.stringify(req.query, null, 2));
    console.log('  - Code received:', code ? 'YES ✅' : 'NO ❌');
    console.log('  - State:', state);
    console.log('  - Error:', error);
    console.log('  - Error Description:', error_description);
    console.log('  - Headers:', JSON.stringify(req.headers, null, 2));
    
    // Crear respuesta de debug
    const debugInfo = {
      timestamp: new Date().toISOString(),
      callback_received: true,
      query_params: req.query,
      code_present: !!code,
      error_present: !!error,
      state_received: state,
      redirect_uri_used: process.env.SALESFORCE_REDIRECT_URI || 'https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback',
      client_id_configured: !!process.env.SALESFORCE_CLIENT_ID,
      client_secret_configured: !!process.env.SALESFORCE_CLIENT_SECRET
    };
    
    // Si hay error OAuth, mostrar debug completo
    if (error) {
      console.error('❌ [OAuth Callback] OAuth Error Detected:', error, error_description);
      
      const errorDebug = {
        ...debugInfo,
        oauth_error: error,
        oauth_error_description: error_description,
        common_errors: {
          'invalid_client_id': 'Consumer Key incorrecto o no existe',
          'invalid_redirect_uri': 'Callback URL no coincide con configuración de Salesforce',
          'access_denied': 'Usuario canceló la autorización',
          'invalid_request': 'Parámetros de solicitud incorrectos',
          'unsupported_response_type': 'Tipo de respuesta no soportado'
        },
        fix_suggestions: error === 'invalid_redirect_uri' ? [
          'Verificar que en Salesforce Connected App el Callback URL sea EXACTAMENTE:',
          process.env.SALESFORCE_REDIRECT_URI || 'https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback',
          'No debe tener espacios, mayúsculas diferentes, o caracteres extra'
        ] : error === 'invalid_client_id' ? [
          'Verificar Consumer Key en Salesforce',
          'Asegurar que la Connected App esté habilitada',
          'Verificar que no hay espacios en la configuración'
        ] : [
          'Revisar configuración de Connected App en Salesforce',
          'Verificar permisos y scopes configurados'
        ]
      };
      
      // Mostrar error en formato HTML para debugging
      return res.send(`
        <html>
          <head><title>OAuth Callback Error - Debug</title></head>
          <body>
            <h1>🔍 OAuth Callback Debug - Error Detected</h1>
            <h2>❌ Error: ${error}</h2>
            <p><strong>Description:</strong> ${error_description || 'No description provided'}</p>
            <h3>📋 Debug Information:</h3>
            <pre>${JSON.stringify(errorDebug, null, 2)}</pre>
            <h3>🔧 Suggested Fixes:</h3>
            <ul>
              ${errorDebug.fix_suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
            </ul>
            <p><a href="${process.env.FRONTEND_URL || 'https://frontend-9ajm.onrender.com'}/admin/integrations">← Volver a Integrations</a></p>
          </body>
        </html>
      `);
    }
    
    // Si no hay código de autorización
    if (!code) {
      console.error('❌ [OAuth Callback] No authorization code received');
      
      const noCodeDebug = {
        ...debugInfo,
        issue: 'No authorization code received',
        possible_causes: [
          'Usuario canceló la autorización',
          'Error en el flujo OAuth',
          'Configuración incorrecta de Connected App'
        ]
      };
      
      return res.send(`
        <html>
          <head><title>OAuth Callback - No Code</title></head>
          <body>
            <h1>🔍 OAuth Callback Debug - No Authorization Code</h1>
            <h2>❌ No se recibió código de autorización</h2>
            <h3>📋 Debug Information:</h3>
            <pre>${JSON.stringify(noCodeDebug, null, 2)}</pre>
            <p><a href="${process.env.FRONTEND_URL || 'https://frontend-9ajm.onrender.com'}/admin/integrations">← Volver a Integrations</a></p>
          </body>
        </html>
      `);
    }
    
    // Tenemos código! Intentar intercambio por token
    const redirectUri = process.env.SALESFORCE_REDIRECT_URI || 'https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback';
    const loginUrl = process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';
    
    console.log('🔄 [OAuth Callback] Exchanging code for token...');
    console.log('  - Login URL:', loginUrl);
    console.log('  - Redirect URI:', redirectUri);
    console.log('  - Client ID:', process.env.SALESFORCE_CLIENT_ID?.substring(0, 20) + '...');
    
    const tokenRequestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      code: code
    });
    
    console.log('🔄 [OAuth Callback] Token request body:', tokenRequestBody.toString());
    
    const tokenResponse = await fetch(`${loginUrl}/services/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestBody
    });
    
    const tokenData = await tokenResponse.json();
    console.log('🎯 [OAuth Callback] Token Response Status:', tokenResponse.status);
    console.log('🎯 [OAuth Callback] Token Response Data:', JSON.stringify(tokenData, null, 2));
    
    if (tokenData.access_token) {
      // ¡ÉXITO! Token obtenido
      console.log('🎉 [OAuth Callback] OAUTH SUCCESS! Token received');
      
      const successDebug = {
        ...debugInfo,
        success: true,
        token_received: true,
        instance_url: tokenData.instance_url,
        token_type: tokenData.token_type,
        scope: tokenData.scope
      };
      
      return res.send(`
        <html>
          <head><title>OAuth Success!</title></head>
          <body>
            <h1>🎉 OAuth Callback Success!</h1>
            <h2>✅ Token recibido exitosamente</h2>
            <p><strong>Instance URL:</strong> ${tokenData.instance_url}</p>
            <p><strong>Token Type:</strong> ${tokenData.token_type}</p>
            <p><strong>Scope:</strong> ${tokenData.scope}</p>
            <h3>📋 Debug Information:</h3>
            <pre>${JSON.stringify(successDebug, null, 2)}</pre>
            <p><a href="${process.env.FRONTEND_URL || 'https://frontend-9ajm.onrender.com'}/admin/integrations?success=oauth_complete">← Volver a Integrations</a></p>
          </body>
        </html>
      `);
    } else {
      // Error en intercambio de token
      console.error('❌ [OAuth Callback] Token exchange failed:', tokenData);
      
      const tokenErrorDebug = {
        ...debugInfo,
        token_exchange_failed: true,
        token_response: tokenData,
        response_status: tokenResponse.status
      };
      
      return res.send(`
        <html>
          <head><title>OAuth Token Exchange Failed</title></head>
          <body>
            <h1>🔍 OAuth Callback Debug - Token Exchange Failed</h1>
            <h2>❌ Error intercambiando código por token</h2>
            <p><strong>Response Status:</strong> ${tokenResponse.status}</p>
            <h3>📋 Token Response:</h3>
            <pre>${JSON.stringify(tokenData, null, 2)}</pre>
            <h3>📋 Full Debug Information:</h3>
            <pre>${JSON.stringify(tokenErrorDebug, null, 2)}</pre>
            <p><a href="${process.env.FRONTEND_URL || 'https://frontend-9ajm.onrender.com'}/admin/integrations">← Volver a Integrations</a></p>
          </body>
        </html>
      `);
    }
    
  } catch (error) {
    console.error('❌ [OAuth Callback] Exception occurred:', error);
    
    const exceptionDebug = {
      timestamp: new Date().toISOString(),
      exception: true,
      error_message: error.message,
      error_stack: error.stack,
      query_params: req.query,
      url: req.url
    };
    
    return res.send(`
      <html>
        <head><title>OAuth Callback Exception</title></head>
        <body>
          <h1>🔍 OAuth Callback Debug - Exception</h1>
          <h2>❌ Excepción durante el callback</h2>
          <p><strong>Error:</strong> ${error.message}</p>
          <h3>📋 Debug Information:</h3>
          <pre>${JSON.stringify(exceptionDebug, null, 2)}</pre>
          <p><a href="${process.env.FRONTEND_URL || 'https://frontend-9ajm.onrender.com'}/admin/integrations">← Volver a Integrations</a></p>
        </body>
      </html>
    `);
  }
});

/**
 * 📋 LIST ACCOUNTS
 * GET /api/salesforce/accounts
 * Listar cuentas de Salesforce (requiere token)
 */
router.get('/accounts', authenticateToken, async (req, res) => {
  try {
    console.log('📋 [List Accounts] User:', req.user.id);
    
    // TODO: Aquí deberías obtener el token del usuario desde la base de datos
    // Por ahora, retornamos un mensaje indicando que se necesita autenticación
    
    res.json({
      status: 'info',
      message: 'OAuth authentication required',
      action: 'Please complete OAuth authentication first',
      accounts: [],
      user: req.user.id
    });
    
  } catch (error) {
    console.error('❌ List accounts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error listing Salesforce accounts',
      error: error.message
    });
  }
});

/**
 * 🆕 CREATE ACCOUNT
 * POST /api/salesforce/accounts
 * Crear nueva cuenta en Salesforce
 */
router.post('/accounts', authenticateToken, async (req, res) => {
  try {
    console.log('🆕 [Create Account] User:', req.user.id);
    console.log('🆕 [Create Account] Data:', req.body);
    
    const { name, type, industry, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        status: 'error',
        message: 'Account name is required'
      });
    }
    
    // TODO: Aquí deberías usar el token del usuario para crear la cuenta
    // Por ahora, retornamos un mensaje indicando que se necesita autenticación
    
    res.json({
      status: 'info',
      message: 'OAuth authentication required',
      action: 'Please complete OAuth authentication first',
      attempted_creation: {
        name,
        type,
        industry,
        description
      },
      user: req.user.id
    });
    
  } catch (error) {
    console.error('❌ Create account error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating Salesforce account',
      error: error.message
    });
  }
});

/**
 * 🔧 DEBUG CONFIGURATION
 * GET /api/salesforce/debug
 * Endpoint para debugging (solo en desarrollo)
 */
router.get('/debug', authenticateToken, async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        status: 'error',
        message: 'Debug endpoint not available in production'
      });
    }
    
    console.log('🔧 [Debug] User:', req.user.id);
    
    const debugInfo = {
      environment: process.env.NODE_ENV,
      user: req.user.id,
      timestamp: new Date().toISOString(),
      salesforce_config: {
        client_id: process.env.SALESFORCE_CLIENT_ID ? `${process.env.SALESFORCE_CLIENT_ID.substring(0, 20)}...` : 'NOT SET',
        client_secret: process.env.SALESFORCE_CLIENT_SECRET ? 'SET' : 'NOT SET',
        redirect_uri: process.env.SALESFORCE_REDIRECT_URI || 'DEFAULT',
        is_sandbox: process.env.SALESFORCE_IS_SANDBOX || 'false',
        login_url: process.env.SALESFORCE_LOGIN_URL || 'DEFAULT'
      },
      endpoints: {
        status: '/api/salesforce/status',
        oauth_url: '/api/salesforce/oauth/url',
        oauth_callback: '/api/salesforce/oauth/callback',
        accounts_list: '/api/salesforce/accounts',
        accounts_create: 'POST /api/salesforce/accounts'
      }
    };
    
    res.json({
      status: 'success',
      message: 'Debug information',
      debug: debugInfo
    });
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error getting debug info',
      error: error.message
    });
  }
});

/**
 * 🔄 OAUTH CALLBACK ALTERNATIVE - NO CONFLICTS
 * GET /api/salesforce/auth-callback
 * Callback alternativo que evita conflictos con archivos estáticos
 */
router.get('/auth-callback', async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;
    
    console.log('🔄 [OAuth Alternative Callback] DETAILED DEBUG:');
    console.log('  - Full URL:', req.url);
    console.log('  - Query Params:', JSON.stringify(req.query, null, 2));
    console.log('  - Code received:', code ? 'YES ✅' : 'NO ❌');
    console.log('  - State:', state);
    console.log('  - Error:', error);
    console.log('  - Error Description:', error_description);
    
    // Si no hay código de autorización
    if (!code && !error) {
      return res.send(`
        <html>
          <head><title>OAuth Callback - No Code</title></head>
          <body>
            <h1>🔍 OAuth Callback Debug - Alternative Endpoint</h1>
            <h2>⚠️ No authorization code received</h2>
            <p>This usually means you accessed this URL directly instead of through the OAuth flow.</p>
            <h3>📋 Debug Information:</h3>
            <pre>${JSON.stringify({
              timestamp: new Date().toISOString(),
              endpoint: '/api/salesforce/auth-callback',
              query_params: req.query,
              message: 'No authorization code provided'
            }, null, 2)}</pre>
            <h3>✅ How to test properly:</h3>
            <ol>
              <li>Generate OAuth URL: <code>GET /api/salesforce/oauth-url-public</code></li>
              <li>Use that URL in your browser</li>
              <li>Complete Salesforce authorization</li>
              <li>You will be redirected here with a code</li>
            </ol>
          </body>
        </html>
      `);
    }
    
    // Si hay error OAuth
    if (error) {
      console.error('❌ [OAuth Alternative Callback] OAuth Error:', error, error_description);
      
      return res.send(`
        <html>
          <head><title>OAuth Error - Alternative Callback</title></head>
          <body>
            <h1>🔍 OAuth Alternative Callback - Error Detected</h1>
            <h2>❌ Error: ${error}</h2>
            <p><strong>Description:</strong> ${error_description || 'No description provided'}</p>
            <h3>📋 Debug Information:</h3>
            <pre>${JSON.stringify({
              timestamp: new Date().toISOString(),
              endpoint: '/api/salesforce/auth-callback',
              query_params: req.query,
              oauth_error: error,
              oauth_error_description: error_description
            }, null, 2)}</pre>
            <h3>🔧 Common Solutions:</h3>
            <ul>
              <li><strong>invalid_redirect_uri:</strong> Check Callback URL in Salesforce Connected App</li>
              <li><strong>invalid_client_id:</strong> Verify Consumer Key configuration</li>
              <li><strong>access_denied:</strong> User cancelled authorization</li>
            </ul>
          </body>
        </html>
      `);
    }
    
    // Si hay código de autorización, procesar
    if (code) {
      console.log('✅ [OAuth Alternative Callback] Authorization code received:', code);
      
      // Aquí intercambiamos el código por token
      const tokenUrl = `${process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com'}/services/oauth2/token`;
      
      const tokenData = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.SALESFORCE_CLIENT_ID,
        client_secret: process.env.SALESFORCE_CLIENT_SECRET,
        redirect_uri: process.env.SALESFORCE_REDIRECT_URI || 'https://backend-service-pu47.onrender.com/api/salesforce/auth-callback',
        code: code
      });
      
      try {
        const tokenResponse = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: tokenData
        });
        
        const tokenResult = await tokenResponse.json();
        
        if (tokenResponse.ok) {
          console.log('🎉 [OAuth Alternative Callback] Token exchange successful!');
          
          return res.send(`
            <html>
              <head><title>OAuth Success - Alternative Callback</title></head>
              <body>
                <h1>🎉 OAuth Authorization Successful!</h1>
                <h2>✅ Token Exchange Completed</h2>
                <h3>📋 Success Information:</h3>
                <pre>${JSON.stringify({
                  timestamp: new Date().toISOString(),
                  endpoint: '/api/salesforce/auth-callback',
                  status: 'success',
                  access_token_received: !!tokenResult.access_token,
                  instance_url: tokenResult.instance_url,
                  token_type: tokenResult.token_type
                }, null, 2)}</pre>
                <h3>🔧 Next Steps:</h3>
                <ul>
                  <li>Integration is now working!</li>
                  <li>Access token obtained successfully</li>
                  <li>You can now use Salesforce API endpoints</li>
                </ul>
              </body>
            </html>
          `);
        } else {
          console.error('❌ [OAuth Alternative Callback] Token exchange failed:', tokenResult);
          
          return res.send(`
            <html>
              <head><title>Token Exchange Error</title></head>
              <body>
                <h1>❌ Token Exchange Failed</h1>
                <h3>📋 Error Information:</h3>
                <pre>${JSON.stringify({
                  timestamp: new Date().toISOString(),
                  endpoint: '/api/salesforce/auth-callback',
                  token_error: tokenResult
                }, null, 2)}</pre>
              </body>
            </html>
          `);
        }
        
      } catch (fetchError) {
        console.error('❌ [OAuth Alternative Callback] Fetch error:', fetchError);
        
        return res.send(`
          <html>
            <head><title>Network Error</title></head>
            <body>
              <h1>❌ Network Error During Token Exchange</h1>
              <h3>📋 Error Information:</h3>
              <pre>${JSON.stringify({
                timestamp: new Date().toISOString(),
                endpoint: '/api/salesforce/auth-callback',
                network_error: fetchError.message
              }, null, 2)}</pre>
            </body>
          </html>
        `);
      }
    }
    
  } catch (error) {
    console.error('❌ [OAuth Alternative Callback] General error:', error);
    res.status(500).send(`
      <html>
        <head><title>Callback Error</title></head>
        <body>
          <h1>❌ Callback Processing Error</h1>
          <h3>📋 Error Information:</h3>
          <pre>${JSON.stringify({
            timestamp: new Date().toISOString(),
            endpoint: '/api/salesforce/auth-callback',
            error: error.message
          }, null, 2)}</pre>
        </body>
      </html>
    `);
  }
});

export default router;
