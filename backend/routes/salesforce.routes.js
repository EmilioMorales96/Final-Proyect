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
 * 🔄 OAUTH CALLBACK
 * GET /api/salesforce/oauth/callback
 * Manejar callback de autorización OAuth
 */
router.get('/oauth/callback', async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;
    
    console.log('🔄 [OAuth Callback] Received:', { 
      code: code ? 'YES' : 'NO', 
      state, 
      error, 
      error_description 
    });
    
    // Manejar errores de OAuth
    if (error) {
      console.error('❌ OAuth Error:', error, error_description);
      return res.redirect(`${process.env.FRONTEND_URL || 'https://frontend-9ajm.onrender.com'}/admin/integrations?error=${error}&description=${encodeURIComponent(error_description || '')}`);
    }
    
    // Verificar que tenemos código de autorización
    if (!code) {
      console.error('❌ No authorization code received');
      return res.redirect(`${process.env.FRONTEND_URL || 'https://frontend-9ajm.onrender.com'}/admin/integrations?error=no_code`);
    }
    
    // Intercambiar código por token
    const redirectUri = process.env.SALESFORCE_REDIRECT_URI || 'https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback';
    const loginUrl = process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';
    
    console.log('🔄 Exchanging code for token...');
    
    const tokenResponse = await fetch(`${loginUrl}/services/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.SALESFORCE_CLIENT_ID,
        client_secret: process.env.SALESFORCE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        code: code
      })
    });
    
    const tokenData = await tokenResponse.json();
    console.log('🎯 Token Response Status:', tokenResponse.status);
    
    if (tokenData.access_token) {
      // ¡ÉXITO! Token obtenido
      console.log('🎉 OAUTH SUCCESS! Token received');
      
      // TODO: Aquí puedes guardar el token en la base de datos asociado al usuario
      // Por ahora, redirigimos con éxito
      
      return res.redirect(`${process.env.FRONTEND_URL || 'https://frontend-9ajm.onrender.com'}/admin/integrations?success=oauth_complete&instance=${encodeURIComponent(tokenData.instance_url || '')}`);
    } else {
      // Error en intercambio de token
      console.error('❌ Token exchange failed:', tokenData);
      return res.redirect(`${process.env.FRONTEND_URL || 'https://frontend-9ajm.onrender.com'}/admin/integrations?error=token_exchange_failed&details=${encodeURIComponent(JSON.stringify(tokenData))}`);
    }
    
  } catch (error) {
    console.error('❌ OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'https://frontend-9ajm.onrender.com'}/admin/integrations?error=callback_exception&message=${encodeURIComponent(error.message)}`);
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

export default router;
