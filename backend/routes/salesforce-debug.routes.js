import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

/**
 * Debug completo de configuración OAuth
 * GET /api/salesforce/debug/oauth-config
 */
router.get('/debug/oauth-config', (req, res) => {
  try {
    const clientId = process.env.SALESFORCE_CLIENT_ID;
    const redirectUri = `${req.protocol}://${req.get('host')}/api/salesforce/oauth/callback`;
    const baseUrl = process.env.SALESFORCE_IS_SANDBOX === 'true' 
      ? 'https://test.salesforce.com' 
      : 'https://login.salesforce.com';

    res.json({
      status: 'debug_info',
      config: {
        client_id: clientId,
        client_id_length: clientId?.length,
        client_id_preview: clientId?.substring(0, 20) + '...',
        redirect_uri: redirectUri,
        base_url: baseUrl,
        is_sandbox: process.env.SALESFORCE_IS_SANDBOX === 'true',
        full_oauth_url: `${baseUrl}/services/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=api%20refresh_token`
      },
      verification_steps: [
        '1. Verifica que el Consumer Key en Salesforce coincida con client_id',
        '2. Verifica que el Callback URL en Salesforce coincida con redirect_uri',
        '3. Asegúrate de que OAuth Settings esté habilitado',
        '4. Verifica que la Connected App esté Active (✓ confirmado)',
        '5. Espera 2-10 minutos para propagación de cambios'
      ]
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * Test directo de token (para debug)
 * GET /api/salesforce/debug/test-token
 */
router.get('/debug/test-token', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.json({
        status: 'info',
        message: 'Este endpoint necesita un código OAuth',
        usage: 'Agregar ?code=TU_CODIGO_OAUTH_AQUI a la URL'
      });
    }

    // Simular el intercambio de token
    const tokenData = {
      url: `${process.env.SALESFORCE_IS_SANDBOX === 'true' ? 'https://test.salesforce.com' : 'https://login.salesforce.com'}/services/oauth2/token`,
      method: 'POST',
      body: {
        grant_type: 'authorization_code',
        client_id: process.env.SALESFORCE_CLIENT_ID,
        client_secret: process.env.SALESFORCE_CLIENT_SECRET,
        redirect_uri: `${req.protocol}://${req.get('host')}/api/salesforce/oauth/callback`,
        code: code
      }
    };

    res.json({
      status: 'token_exchange_preview',
      message: 'Configuración para intercambio de token',
      token_request: tokenData,
      note: 'Este endpoint solo muestra la configuración, no hace la petición real'
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
