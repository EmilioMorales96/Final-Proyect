import express from 'express';
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

// 🎯 SALESFORCE INTEGRATION - CLEAN VERSION
// =========================================

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
        test: 'GET /api/salesforce/test (public)',
        auth_callback: 'GET /api/salesforce/auth-callback (alternative callback)'
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
 * 📊 STATUS ENDPOINT - REQUIRES AUTH
 * GET /api/salesforce/status
 * Estado del sistema Salesforce
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    console.log('📊 [Status] Checking Salesforce status...');
    
    const status = {
      service: 'Salesforce Integration',
      version: '1.0.0-clean',
      timestamp: new Date().toISOString(),
      configuration: {
        client_id: !!process.env.SALESFORCE_CLIENT_ID,
        client_secret: !!process.env.SALESFORCE_CLIENT_SECRET,
        redirect_uri: process.env.SALESFORCE_REDIRECT_URI,
        sandbox: process.env.SALESFORCE_IS_SANDBOX === 'true',
        login_url: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com'
      },
      ready: !!(process.env.SALESFORCE_CLIENT_ID && process.env.SALESFORCE_CLIENT_SECRET)
    };
    
    res.json({
      status: 'success',
      data: status
    });
    
  } catch (error) {
    console.error('❌ Status check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error checking status',
      error: error.message
    });
  }
});

/**
 * 🔗 OAUTH URL GENERATOR - REQUIRES AUTH
 * GET /api/salesforce/oauth/url
 * Generar URL de autorización OAuth
 */
router.get('/oauth/url', authenticateToken, async (req, res) => {
  try {
    console.log('🔗 [OAuth URL] Generating...');
    
    // Verificar configuración
    if (!process.env.SALESFORCE_CLIENT_ID || !process.env.SALESFORCE_CLIENT_SECRET) {
      return res.status(400).json({
        status: 'error',
        message: 'Salesforce not configured. Missing CLIENT_ID or CLIENT_SECRET.'
      });
    }
    
    const redirectUri = process.env.SALESFORCE_REDIRECT_URI || 'https://backend-service-pu47.onrender.com/api/salesforce/auth-callback';
    const loginUrl = process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';
    
    // Construir URL OAuth
    const authUrl = new URL(`${loginUrl}/services/oauth2/authorize`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', process.env.SALESFORCE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'api refresh_token offline_access');
    authUrl.searchParams.set('state', `oauth_${Date.now()}`);
    authUrl.searchParams.set('prompt', 'consent');
    
    console.log('✅ OAuth URL generated successfully');
    
    res.json({
      status: 'success',
      message: 'OAuth URL generated',
      oauth_url: authUrl.toString(),
      redirect_uri: redirectUri
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
 * 🔗 OAUTH URL GENERATOR PUBLIC
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
    
    const redirectUri = process.env.SALESFORCE_REDIRECT_URI || 'https://backend-service-pu47.onrender.com/api/salesforce/auth-callback';
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
      message: 'Error generating OAuth URL (PUBLIC)',
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

/**
 * 🔄 OAUTH CALLBACK ORIGINAL
 * GET /api/salesforce/oauth/callback
 * Callback original (puede tener conflictos con archivos estáticos)
 */
router.get('/oauth/callback', async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;
    
    console.log('🔄 [OAuth Original Callback] DETAILED DEBUG:');
    console.log('  - Full URL:', req.url);
    console.log('  - Query Params:', JSON.stringify(req.query, null, 2));
    console.log('  - Code received:', code ? 'YES ✅' : 'NO ❌');
    
    // Mostrar mensaje informativo
    return res.send(`
      <html>
        <head><title>OAuth Callback - Original Endpoint</title></head>
        <body>
          <h1>🔍 OAuth Original Callback Endpoint</h1>
          <h2>⚠️ This endpoint may have conflicts with static files</h2>
          <p>For better debugging, use the alternative callback: <strong>/api/salesforce/auth-callback</strong></p>
          <h3>📋 Debug Information:</h3>
          <pre>${JSON.stringify({
            timestamp: new Date().toISOString(),
            endpoint: '/api/salesforce/oauth/callback',
            query_params: req.query,
            code_received: !!code,
            error_received: !!error,
            recommendation: 'Use /api/salesforce/auth-callback instead'
          }, null, 2)}</pre>
        </body>
      </html>
    `);
    
  } catch (error) {
    console.error('❌ [OAuth Original Callback] Error:', error);
    res.status(500).send(`
      <html>
        <head><title>Callback Error</title></head>
        <body>
          <h1>❌ Original Callback Error</h1>
          <p>Error: ${error.message}</p>
          <p>Please use: <strong>/api/salesforce/auth-callback</strong></p>
        </body>
      </html>
    `);
  }
});

/**
 * 🏢 SALESFORCE ACCOUNTS - REQUIRES AUTH
 * GET /api/salesforce/accounts
 * Obtener cuentas de Salesforce
 */
router.get('/accounts', authenticateToken, async (req, res) => {
  try {
    console.log('🏢 [Accounts] Fetching accounts...');
    
    // Aquí iría la lógica para obtener cuentas usando el access token
    res.json({
      status: 'success',
      message: 'Accounts endpoint - ready for implementation',
      note: 'OAuth flow must be completed first to get access tokens'
    });
    
  } catch (error) {
    console.error('❌ Accounts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching accounts',
      error: error.message
    });
  }
});

/**
 * 🔧 DEBUG ENDPOINT - REQUIRES AUTH
 * GET /api/salesforce/debug
 * Información de debug del sistema
 */
router.get('/debug', authenticateToken, async (req, res) => {
  try {
    console.log('🔧 [Debug] Gathering debug information...');
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      system: 'Salesforce Integration - Clean Version',
      environment: process.env.NODE_ENV || 'development',
      configuration: {
        client_id_length: process.env.SALESFORCE_CLIENT_ID ? process.env.SALESFORCE_CLIENT_ID.length : 0,
        client_secret_configured: !!process.env.SALESFORCE_CLIENT_SECRET,
        redirect_uri: process.env.SALESFORCE_REDIRECT_URI,
        login_url: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com',
        is_sandbox: process.env.SALESFORCE_IS_SANDBOX === 'true'
      },
      endpoints: {
        test: '/api/salesforce/test',
        status: '/api/salesforce/status (auth required)',
        oauth_url: '/api/salesforce/oauth/url (auth required)',
        oauth_url_public: '/api/salesforce/oauth-url-public',
        oauth_callback: '/api/salesforce/oauth/callback',
        auth_callback: '/api/salesforce/auth-callback (recommended)',
        accounts: '/api/salesforce/accounts (auth required)',
        debug: '/api/salesforce/debug (auth required)'
      }
    };
    
    res.json({
      status: 'success',
      data: debugInfo
    });
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error gathering debug information',
      error: error.message
    });
  }
});

export default router;
