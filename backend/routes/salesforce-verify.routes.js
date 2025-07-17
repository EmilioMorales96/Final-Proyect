import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

/**
 * Endpoint para verificar configuración paso a paso
 */
router.get('/verify-step-by-step', (req, res) => {
  const clientId = process.env.SALESFORCE_CLIENT_ID;
  
  res.json({
    step_1_client_id_check: {
      current_client_id: clientId,
      length: clientId?.length,
      starts_with_3MVG: clientId?.startsWith('3MVG'),
      first_20_chars: clientId?.substring(0, 20),
      last_10_chars: clientId?.substring(-10)
    },
    step_2_callback_url: {
      configured_url: 'https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback',
      note: 'This must match exactly in Salesforce'
    },
    step_3_oauth_settings: {
      required_in_salesforce: [
        'Enable OAuth Settings = checked',
        'Callback URL = https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback',
        'Selected OAuth Scopes should include: Access your basic information (id, profile, email, address, phone), Manage user data via APIs (api), Perform requests on your behalf at any time (refresh_token, offline_access)'
      ]
    },
    step_4_test_different_client_id: {
      message: 'If the Consumer Key in Salesforce is different, copy the EXACT Consumer Key from Salesforce',
      current_we_have: clientId,
      instructions: [
        '1. Go to Setup → Apps → App Manager',
        '2. Click on your Connected App',
        '3. Click View or Manage',
        '4. Find API (Enable OAuth Settings) section',
        '5. Copy the Consumer Key EXACTLY as shown',
        '6. Replace SALESFORCE_CLIENT_ID in .env file'
      ]
    }
  });
});

/**
 * Endpoint para probar con un Client ID diferente
 */
router.post('/test-with-client-id', (req, res) => {
  const { client_id } = req.body;
  
  if (!client_id) {
    return res.status(400).json({
      error: 'client_id is required in request body'
    });
  }
  
  const redirectUri = 'https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback';
  const baseUrl = 'https://login.salesforce.com';
  
  const testOauthUrl = `${baseUrl}/services/oauth2/authorize?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=api%20refresh_token`;
  
  res.json({
    status: 'test_url_generated',
    provided_client_id: client_id,
    test_oauth_url: testOauthUrl,
    instructions: [
      '1. Copy the test_oauth_url above',
      '2. Test it in your browser',
      '3. If it works, update your .env file with this client_id'
    ]
  });
});

export default router;
