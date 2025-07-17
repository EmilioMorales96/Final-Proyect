import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

/**
 * BATALLA FINAL - OAuth con TODOS los parámetros posibles
 * GET /api/salesforce/final-battle-oauth
 */
router.get('/final-battle-oauth', (req, res) => {
  try {
    const clientId = process.env.SALESFORCE_CLIENT_ID;
    const redirectUri = `${req.protocol}://${req.get('host')}/api/salesforce/oauth/callback`;
    
    // Probar con TODOS los scopes y parámetros que Salesforce puede querer
    const fullScopeOAuthUrl = `https://login.salesforce.com/services/oauth2/authorize?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent('api refresh_token offline_access openid profile email')}&` +
      `state=battle_final&` +
      `prompt=consent`;
    
    // También crear una versión con scopes mínimos
    const minimalScopeOAuthUrl = `https://login.salesforce.com/services/oauth2/authorize?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent('api')}&` +
      `state=battle_minimal`;
    
    console.log('⚔️  BATALLA FINAL INICIADA!');
    console.log('🎯 Client ID:', clientId?.substring(0, 20) + '...');
    console.log('🔗 Redirect URI:', redirectUri);
    
    res.json({
      status: 'BATTLE_READY',
      message: '⚔️ BATALLA FINAL - Múltiples estrategias OAuth',
      strategies: {
        strategy_1_full_scopes: {
          description: 'OAuth con TODOS los scopes posibles',
          url: fullScopeOAuthUrl,
          scopes: 'api, refresh_token, offline_access, openid, profile, email',
          notes: 'Máxima compatibilidad - incluye todos los permisos'
        },
        strategy_2_minimal: {
          description: 'OAuth con scope mínimo',
          url: minimalScopeOAuthUrl,
          scopes: 'api solamente',
          notes: 'Mínimo requerido - puede evitar conflictos'
        }
      },
      battle_plan: [
        '1. Prueba STRATEGY 1 primero (full scopes)',
        '2. Si falla, usa STRATEGY 2 (minimal)',
        '3. Ambas usan el Consumer Key correcto',
        '4. Ambas incluyen state parameter para tracking'
      ],
      debug_info: {
        client_id_length: clientId?.length,
        client_id_valid: clientId?.startsWith('3MVG'),
        redirect_uri: redirectUri,
        backend_host: req.get('host'),
        protocol: req.protocol
      }
    });
    
  } catch (error) {
    console.error('❌ Error en batalla final:', error);
    res.status(500).json({
      status: 'BATTLE_ERROR',
      error: error.message
    });
  }
});

/**
 * OAuth callback mejorado para batalla final
 * GET /api/salesforce/oauth/battle-callback
 */
router.get('/oauth/battle-callback', async (req, res) => {
  try {
    console.log('⚔️  CALLBACK DE BATALLA RECIBIDO!');
    console.log('📥 Query params:', req.query);
    
    const { code, error, state } = req.query;

    if (error) {
      console.error('❌ OAuth error en batalla:', error);
      return res.json({
        status: 'BATTLE_OAUTH_ERROR',
        error: error,
        state: state,
        message: 'Error OAuth detectado en batalla final',
        next_action: 'Revisar configuración de Connected App'
      });
    }

    if (!code) {
      console.error('❌ No code en batalla');
      return res.json({
        status: 'BATTLE_NO_CODE',
        state: state,
        message: 'Código de autorización no recibido',
        debug: 'Salesforce no envió el parámetro code'
      });
    }

    console.log('✅ Código OAuth recibido en batalla:', code.substring(0, 10) + '...');
    console.log('🏷️  State:', state);
    
    // Intercambio de token con MÁXIMA información
    const redirectUri = `${req.protocol}://${req.get('host')}/api/salesforce/oauth/battle-callback`;
    const tokenEndpoint = 'https://login.salesforce.com/services/oauth2/token';
    
    const tokenPayload = {
      grant_type: 'authorization_code',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      code: code
    };
    
    console.log('🚀 Iniciando intercambio de token...');
    console.log('📡 Endpoint:', tokenEndpoint);
    console.log('📤 Payload (sin secret):', {
      ...tokenPayload,
      client_secret: '[HIDDEN]'
    });

    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams(tokenPayload)
    });

    console.log('📥 Token response status:', tokenResponse.status);
    console.log('📥 Token response headers:', Object.fromEntries(tokenResponse.headers.entries()));

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Token exchange failed en batalla:', errorText);
      
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch (e) {
        errorJson = { raw_error: errorText };
      }
      
      return res.json({
        status: 'BATTLE_TOKEN_FAILED',
        http_status: tokenResponse.status,
        error_response: errorJson,
        payload_sent: {
          ...tokenPayload,
          client_secret: '[HIDDEN]'
        },
        endpoint: tokenEndpoint,
        troubleshooting: [
          'Verificar que el Consumer Secret sea correcto',
          'Verificar que la Connected App tenga "Admin approved users are pre-authorized"',
          'Verificar que el usuario tenga permisos en la Connected App'
        ]
      });
    }

    const tokenData = await tokenResponse.json();
    console.log('🎉 ¡VICTORIA EN LA BATALLA! Tokens recibidos!');
    console.log('🏆 Instance URL:', tokenData.instance_url);
    console.log('🏆 Token type:', tokenData.token_type);
    
    // ¡ÉXITO TOTAL!
    return res.json({
      status: 'BATTLE_VICTORY',
      message: '🎉 ¡BATALLA GANADA! OAuth completado exitosamente',
      victory_data: {
        instance_url: tokenData.instance_url,
        token_type: tokenData.token_type,
        scope: tokenData.scope,
        issued_at: tokenData.issued_at
      },
      battle_info: {
        state: state,
        code_received: !!code,
        endpoint_used: tokenEndpoint,
        redirect_uri: redirectUri
      },
      celebration: '🎊🎊🎊 ¡SALESFORCE OAUTH CONQUISTADO! 🎊🎊🎊'
    });

  } catch (error) {
    console.error('💥 Error crítico en batalla:', error);
    return res.status(500).json({
      status: 'BATTLE_CRITICAL_ERROR',
      error: error.message,
      stack: error.stack
    });
  }
});

export default router;
