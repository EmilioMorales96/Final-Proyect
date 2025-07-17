import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

/**
 * OAuth callback con logging detallado
 * GET /api/salesforce/oauth/debug-callback
 */
router.get('/oauth/debug-callback', async (req, res) => {
  try {
    console.log('🔍 DEBUG CALLBACK INICIADO');
    console.log('Query params:', req.query);
    console.log('Headers:', req.headers);
    
    const { code, error, state } = req.query;

    if (error) {
      console.error('❌ OAuth error recibido:', error);
      return res.json({
        status: 'oauth_error',
        error: error,
        query_params: req.query,
        message: 'Error en OAuth detectado'
      });
    }

    if (!code) {
      console.error('❌ No hay código OAuth');
      return res.json({
        status: 'no_code',
        query_params: req.query,
        message: 'Authorization code not received',
        debug: 'No se recibió el parámetro code en la URL'
      });
    }

    console.log('✅ Código OAuth recibido:', code.substring(0, 20) + '...');
    
    // Configurar para intercambio de token
    const redirectUri = `${req.protocol}://${req.get('host')}/api/salesforce/oauth/callback`;
    const authEndpoint = process.env.SALESFORCE_IS_SANDBOX === 'true' 
      ? 'https://test.salesforce.com/services/oauth2/token'
      : 'https://login.salesforce.com/services/oauth2/token';
    
    console.log('🔗 Endpoint para token:', authEndpoint);
    console.log('🔗 Redirect URI:', redirectUri);
    
    const tokenPayload = {
      grant_type: 'authorization_code',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      code: code
    };
    
    console.log('📤 Payload para token exchange:', {
      ...tokenPayload,
      client_secret: 'HIDDEN'
    });

    const tokenResponse = await fetch(authEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(tokenPayload)
    });

    console.log('📥 Respuesta del token exchange:', tokenResponse.status, tokenResponse.statusText);

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('❌ Token exchange falló:', errorData);
      
      return res.json({
        status: 'token_exchange_failed',
        http_status: tokenResponse.status,
        error_response: errorData,
        payload_sent: {
          ...tokenPayload,
          client_secret: 'HIDDEN'
        },
        endpoint_used: authEndpoint
      });
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Tokens recibidos exitosamente!');
    console.log('Instance URL:', tokenData.instance_url);
    console.log('Token type:', tokenData.token_type);
    
    return res.json({
      status: 'success',
      message: 'OAuth completado exitosamente!',
      salesforce: {
        instance_url: tokenData.instance_url,
        token_type: tokenData.token_type,
        scope: tokenData.scope,
        issued_at: tokenData.issued_at
      },
      debug: {
        code_received: !!code,
        redirect_uri: redirectUri,
        endpoint_used: authEndpoint
      }
    });

  } catch (error) {
    console.error('❌ Error en debug callback:', error);
    return res.status(500).json({
      status: 'callback_error',
      error: error.message,
      stack: error.stack
    });
  }
});

export default router;
