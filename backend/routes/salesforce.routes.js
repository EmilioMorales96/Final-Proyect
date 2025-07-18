import express from 'express';
import authenticateToken from '../middleware/auth.middleware.js';
import db from '../models/index.js';
import crypto from 'crypto';

const router = express.Router();
// ...existing code...


/**
 * PUBLIC TEST ENDPOINT
 * GET /api/salesforce/test
 * Returns current Salesforce configuration status for debugging.
 * No authentication required.
 */
router.get('/test', async (req, res) => {
  try {
    // Gather configuration status
    const config = {
      client_id_configured: Boolean(process.env.SALESFORCE_CLIENT_ID),
      client_secret_configured: Boolean(process.env.SALESFORCE_CLIENT_SECRET),
      redirect_uri: process.env.SALESFORCE_REDIRECT_URI || 'DEFAULT',
      is_sandbox: process.env.SALESFORCE_IS_SANDBOX || 'false',
      login_url: process.env.SALESFORCE_LOGIN_URL || 'DEFAULT',
      environment: process.env.NODE_ENV || 'development'
    };

    // Respond with configuration and endpoint info
    res.json({
      status: 'success',
      message: 'Salesforce public test endpoint',
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
    // Error handling
    console.error('[Salesforce Test] Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error in public test endpoint',
      error: error.message
    });
  }
});


/**
 * STATUS ENDPOINT
 * GET /api/salesforce/status
 * Returns Salesforce configuration status for the authenticated user.
 * Requires authentication.
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    // Log user making the request
    console.log('[Salesforce Status] User:', req.user.id);

    // Build configuration status object
    const config = {
      client_id: process.env.SALESFORCE_CLIENT_ID ? 'CONFIGURED ✅' : 'MISSING ❌',
      client_secret: process.env.SALESFORCE_CLIENT_SECRET ? 'CONFIGURED ✅' : 'MISSING ❌',
      redirect_uri: process.env.SALESFORCE_REDIRECT_URI || 'https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback',
      is_sandbox: process.env.SALESFORCE_IS_SANDBOX || 'false',
      login_url: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com'
    };

    // Respond with configuration status
    res.json({
      status: 'success',
      message: 'Salesforce configuration status',
      user: req.user.id,
      configuration: config,
      ready_for_oauth: Boolean(process.env.SALESFORCE_CLIENT_ID && process.env.SALESFORCE_CLIENT_SECRET)
    });
  } catch (error) {
    // Error handling
    console.error('[Salesforce Status] Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error getting Salesforce status',
      error: error.message
    });
  }
});


/**
 * OAUTH URL ENDPOINT
 * GET /api/salesforce/oauth/url
 * Generates Salesforce OAuth authorization URL with PKCE for the authenticated user.
 * Requires authentication.
 */
router.get('/oauth/url', authenticateToken, async (req, res) => {
  try {
    // Ensure required configuration is present
    if (!process.env.SALESFORCE_CLIENT_ID || !process.env.SALESFORCE_CLIENT_SECRET) {
      return res.status(400).json({
        status: 'error',
        message: 'Salesforce not configured. Missing CLIENT_ID or CLIENT_SECRET.'
      });
    }

    // Prepare OAuth parameters
    const redirectUri = process.env.SALESFORCE_REDIRECT_URI || 'https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback';
    const loginUrl = process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';

    // PKCE: Generate code_verifier and code_challenge
    function base64URLEncode(buffer) {
      return Buffer.from(buffer)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }
    function sha256(buffer) {
      return crypto.createHash('sha256').update(buffer).digest();
    }
    function generateCodeVerifier(length = 64) {
      return base64URLEncode(crypto.randomBytes(length));
    }

    const code_verifier = generateCodeVerifier();
    const code_challenge = base64URLEncode(sha256(code_verifier));

    // Store code_verifier for later token exchange (in-memory for demo)
    if (!global.salesforcePKCE) global.salesforcePKCE = {};
    global.salesforcePKCE[req.user.id] = {
      code_verifier,
      created: Date.now()
    };

    // Build OAuth URL
    const authUrl = new URL(`${loginUrl}/services/oauth2/authorize`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', process.env.SALESFORCE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'api refresh_token offline_access');
    authUrl.searchParams.set('state', `user_${req.user.id}_${Date.now()}`);
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('code_challenge', code_challenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');

    // Respond with OAuth URL and PKCE info
    res.json({
      status: 'success',
      message: 'OAuth URL generated (PKCE)',
      oauth_url: authUrl.toString(),
      configuration: {
        client_id: process.env.SALESFORCE_CLIENT_ID.substring(0, 20) + '...',
        redirect_uri: redirectUri,
        login_url: loginUrl,
        code_challenge,
        code_challenge_method: 'S256'
      }
    });
  } catch (error) {
    // Error handling
    console.error('[OAuth URL] Generation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating OAuth URL',
      error: error.message
    });
  }
});


/**
 * OAUTH URL PUBLIC ENDPOINT
 * GET /api/salesforce/oauth-url-public
 * Generates Salesforce OAuth authorization URL for public testing (no PKCE, no auth required).
 */
router.get('/oauth-url-public', async (req, res) => {
  try {
    // Ensure required configuration is present
    if (!process.env.SALESFORCE_CLIENT_ID || !process.env.SALESFORCE_CLIENT_SECRET) {
      return res.status(400).json({
        status: 'error',
        message: 'Salesforce not configured. Missing CLIENT_ID or CLIENT_SECRET.'
      });
    }

    // Prepare OAuth parameters
    const redirectUri = process.env.SALESFORCE_REDIRECT_URI || 'https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback';
    const loginUrl = process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';

    // Build OAuth URL (no PKCE)
    const authUrl = new URL(`${loginUrl}/services/oauth2/authorize`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', process.env.SALESFORCE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'api refresh_token offline_access');
    authUrl.searchParams.set('state', `public_test_${Date.now()}`);
    authUrl.searchParams.set('prompt', 'consent');

    // Respond with OAuth URL
    res.json({
      status: 'success',
      message: 'OAuth URL generated for public testing',
      oauth_url: authUrl.toString(),
      configuration: {
        client_id: process.env.SALESFORCE_CLIENT_ID.substring(0, 20) + '...',
        redirect_uri: redirectUri,
        login_url: loginUrl
      }
    });
  } catch (error) {
    // Error handling
    console.error('[OAuth URL Public] Generation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating OAuth URL',
      error: error.message
    });
  }
});


/**
 * OAUTH CALLBACK ENDPOINT
 * GET /api/salesforce/oauth/callback
 * Handles Salesforce OAuth callback, exchanges code for token, and persists token for user.
 */
router.get('/oauth/callback', async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;

    // If OAuth error, respond with error message
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: `OAuth error: ${error}`,
        description: error_description || null
      });
    }

    // If no code, respond with error
    if (!code) {
      return res.status(400).json({
        status: 'error',
        message: 'No authorization code received',
        possible_causes: [
          'User cancelled authorization',
          'OAuth flow error',
          'Incorrect Connected App configuration'
        ]
      });
    }

    // Exchange code for token
    const redirectUri = process.env.SALESFORCE_REDIRECT_URI || 'https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback';
    const loginUrl = process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';

    const tokenRequestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      code: code
    });

    const tokenResponse = await fetch(`${loginUrl}/services/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestBody
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.access_token) {
      // Extract userId from state (format: user_<id>_timestamp)
      let userId = null;
      if (state && state.startsWith('user_')) {
        const parts = state.split('_');
        if (parts.length >= 2) {
          userId = parseInt(parts[1], 10);
        }
      }

      // Persist token for user
      if (userId) {
        await db.SalesforceToken.upsert({
          userId,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token || null,
          instanceUrl: tokenData.instance_url || null,
          tokenType: tokenData.token_type || null,
          scope: tokenData.scope || null,
          expiresIn: tokenData.expires_in || null
        });
      }

      // Redirect to frontend with success
      return res.redirect(`${process.env.FRONTEND_URL || 'https://frontend-9ajm.onrender.com'}/admin/integrations?success=oauth_connected`);
    } else {
      // Token exchange failed
      return res.status(400).json({
        status: 'error',
        message: 'Token exchange failed',
        token_response: tokenData
      });
    }
  } catch (error) {
    // General error handling
    return res.status(500).json({
      status: 'error',
      message: 'Exception during OAuth callback',
      error: error.message
    });
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
    
    // Obtener el token de Salesforce del usuario
    const tokenRecord = await db.SalesforceToken.findOne({ where: { userId: req.user.id } });
    if (!tokenRecord || !tokenRecord.accessToken) {
      return res.json({
        status: 'info',
        message: 'OAuth authentication required',
        action: 'Please complete OAuth authentication first',
        accounts: [],
        user: req.user.id
      });
    }

    // Llamar a Salesforce para obtener cuentas reales
    try {
      const response = await fetch(`${tokenRecord.instanceUrl}/services/data/v58.0/query?q=SELECT+Id,Name,Industry,Phone,Website+FROM+Account+LIMIT+10`, {
        headers: {
          'Authorization': `Bearer ${tokenRecord.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.records) {
        return res.json({
          status: 'success',
          message: 'Accounts fetched from Salesforce',
          accounts: data.records,
          user: req.user.id
        });
      } else {
        return res.json({
          status: 'error',
          message: 'No accounts found or error in Salesforce response',
          details: data,
          user: req.user.id
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Error fetching accounts from Salesforce',
        error: err.message,
        user: req.user.id
      });
    }
    
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
