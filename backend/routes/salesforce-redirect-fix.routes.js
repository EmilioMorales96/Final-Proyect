import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// 🎯 ENDPOINT CRÍTICO: Verificación y corrección del Redirect URI
router.get('/redirect-uri-fix', async (req, res) => {
  try {
    console.log('🔧 INICIANDO VERIFICACIÓN DE REDIRECT URI...');
    
    const currentRedirectUri = process.env.SALESFORCE_REDIRECT_URI || process.env.SALESFORCE_CALLBACK_URL;
    const expectedRedirectUri = 'https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback';
    
    const configStatus = {
      message: '🎯 DIAGNÓSTICO CRÍTICO DE REDIRECT URI',
      timestamp: new Date().toISOString(),
      current_config: {
        SALESFORCE_CLIENT_ID: process.env.SALESFORCE_CLIENT_ID ? `${process.env.SALESFORCE_CLIENT_ID.substring(0, 20)}...` : 'FALTANTE ❌',
        SALESFORCE_CLIENT_SECRET: process.env.SALESFORCE_CLIENT_SECRET ? 'CONFIGURADO ✅' : 'FALTANTE ❌',
        SALESFORCE_REDIRECT_URI: currentRedirectUri,
        SALESFORCE_IS_SANDBOX: process.env.SALESFORCE_IS_SANDBOX
      },
      redirect_uri_analysis: {
        current_uri: currentRedirectUri,
        expected_uri: expectedRedirectUri,
        is_correct: currentRedirectUri === expectedRedirectUri,
        problem_detected: currentRedirectUri !== expectedRedirectUri
      },
      action_required: {
        step_1: 'Ve a tu Salesforce Setup → App Manager',
        step_2: 'Busca tu Connected App: "Form Management Integration"',
        step_3: 'Haz clic en "View" y luego "Edit"',
        step_4: 'En "Callback URL" debe estar EXACTAMENTE:',
        required_callback_url: expectedRedirectUri,
        step_5: 'Guarda los cambios y espera 2-10 minutos para propagación'
      },
      new_oauth_url_generation: {
        status: 'GENERANDO NUEVA URL CON REDIRECT URI CORREGIDO...'
      }
    };

    // Generar nueva URL OAuth con redirect URI corregido
    const authUrl = new URL('https://login.salesforce.com/services/oauth2/authorize');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', process.env.SALESFORCE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', expectedRedirectUri);
    authUrl.searchParams.set('scope', 'api refresh_token offline_access');
    authUrl.searchParams.set('state', 'redirect_fix_battle');
    authUrl.searchParams.set('prompt', 'consent');

    configStatus.corrected_oauth_url = {
      url: authUrl.toString(),
      instructions: [
        '1. Primero ASEGÚRATE de que el Callback URL en Salesforce sea: ' + expectedRedirectUri,
        '2. Espera 2-10 minutos después de guardar en Salesforce',
        '3. Luego usa esta URL para autenticación',
        '4. La URL ya incluye el redirect URI corregido'
      ]
    };

    console.log('🎯 Redirect URI Fix Status:', JSON.stringify(configStatus, null, 2));
    
    res.json(configStatus);
    
  } catch (error) {
    console.error('❌ Error en redirect URI fix:', error);
    res.status(500).json({
      error: 'Error en verificación de redirect URI',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 🔧 ENDPOINT: Test del redirect URI corregido
router.get('/test-redirect-callback', async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;
    
    console.log('🧪 TESTING REDIRECT CALLBACK:');
    console.log('  - Code received:', code ? 'SÍ ✅' : 'NO ❌');
    console.log('  - State:', state);
    console.log('  - Error:', error);
    console.log('  - Error Description:', error_description);
    
    if (error) {
      return res.json({
        status: 'ERROR_IN_CALLBACK',
        error: error,
        error_description: error_description,
        state: state,
        analysis: {
          error_type: error,
          common_causes: {
            'invalid_client_id': 'Consumer Key incorrecto',
            'invalid_redirect_uri': 'Callback URL no coincide con Salesforce',
            'access_denied': 'Usuario canceló la autorización',
            'unsupported_response_type': 'Configuración OAuth incorrecta'
          }
        },
        next_steps: [
          'Verificar que el Callback URL en Salesforce sea exactamente: https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback',
          'Verificar que el Consumer Key sea: ' + process.env.SALESFORCE_CLIENT_ID?.substring(0, 20) + '...',
          'Esperar 2-10 minutos después de cambios en Salesforce'
        ]
      });
    }
    
    if (code) {
      // Tenemos código de autorización - intentar intercambio por token
      console.log('🎉 CÓDIGO DE AUTORIZACIÓN RECIBIDO - INTERCAMBIANDO POR TOKEN...');
      
      const tokenResponse = await fetch('https://login.salesforce.com/services/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.SALESFORCE_CLIENT_ID,
          client_secret: process.env.SALESFORCE_CLIENT_SECRET,
          redirect_uri: 'https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback',
          code: code
        })
      });
      
      const tokenData = await tokenResponse.json();
      console.log('🔑 Token Response:', tokenData);
      
      if (tokenData.access_token) {
        return res.json({
          status: '🎉 ¡ÉXITO TOTAL!',
          message: '¡OAuth funciona perfectamente!',
          token_received: true,
          instance_url: tokenData.instance_url,
          token_type: tokenData.token_type,
          next_step: 'Ahora puedes usar las funciones de Salesforce'
        });
      } else {
        return res.json({
          status: 'TOKEN_EXCHANGE_FAILED',
          error: tokenData,
          analysis: 'El código se recibió pero falló el intercambio por token'
        });
      }
    }
    
    res.json({
      status: 'CALLBACK_RECEIVED',
      message: 'Callback recibido sin código ni error',
      query_params: req.query
    });
    
  } catch (error) {
    console.error('❌ Error en test redirect callback:', error);
    res.status(500).json({
      error: 'Error en test de callback',
      message: error.message
    });
  }
});

export default router;
