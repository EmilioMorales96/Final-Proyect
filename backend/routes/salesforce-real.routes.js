import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

/**
 * REAL Salesforce Integration usando Client Credentials
 * POST /api/salesforce/real/create-account
 */
router.post('/real/create-account', async (req, res) => {
  try {
    const { company, phone, website, industry, annualRevenue, numberOfEmployees } = req.body;

    if (!company) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Company name is required' 
      });
    }

    console.log('🚀 REAL SALESFORCE - Creating account for:', company);

    // Obtener token de acceso REAL
    const authUrl = 'https://login.salesforce.com/services/oauth2/token';
    
    console.log('🔐 Getting REAL access token...');
    console.log('Client ID:', process.env.SALESFORCE_CLIENT_ID?.substring(0, 20) + '...');
    
    const tokenResponse = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.SALESFORCE_CLIENT_ID,
        client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      })
    });

    console.log('Token response status:', tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Auth failed:', errorText);
      
      return res.status(500).json({
        status: 'auth_error',
        message: 'Failed to authenticate with Salesforce',
        error: errorText,
        debug: {
          status: tokenResponse.status,
          statusText: tokenResponse.statusText,
          client_id_configured: !!process.env.SALESFORCE_CLIENT_ID,
          client_secret_configured: !!process.env.SALESFORCE_CLIENT_SECRET
        }
      });
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ REAL token received!');
    console.log('Instance URL:', tokenData.instance_url);

    // Crear cuenta REAL en Salesforce
    const accountData = {
      Name: company,
      Website: website || null,
      Phone: phone || null,
      Industry: industry || null,
      AnnualRevenue: annualRevenue ? parseFloat(annualRevenue) : null,
      NumberOfEmployees: numberOfEmployees ? parseInt(numberOfEmployees) : null,
      Type: 'Prospect',
      Description: `REAL account created via Forms App - ${new Date().toISOString()}`,
      LeadSource: 'Forms App Real Integration'
    };

    console.log('📝 Creating REAL account in Salesforce...');

    const accountResponse = await fetch(`${tokenData.instance_url}/services/data/v52.0/sobjects/Account/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData)
    });

    console.log('Account creation response status:', accountResponse.status);

    if (!accountResponse.ok) {
      const errorData = await accountResponse.json();
      console.error('❌ Account creation failed:', errorData);
      
      return res.status(500).json({
        status: 'creation_error',
        message: 'Failed to create account in Salesforce',
        error: errorData[0]?.message || 'Unknown error',
        details: errorData,
        debug: {
          instance_url: tokenData.instance_url,
          account_data: accountData
        }
      });
    }

    const accountResult = await accountResponse.json();
    console.log('✅ REAL ACCOUNT CREATED!', accountResult.id);

    // Respuesta con datos REALES
    return res.json({
      status: 'success',
      message: 'REAL account created successfully in Salesforce!',
      integration: 'REAL - NO SIMULATION',
      salesforce: {
        account_id: accountResult.id,
        instance_url: tokenData.instance_url,
        account_url: `${tokenData.instance_url}/lightning/r/Account/${accountResult.id}/view`,
        api_url: `${tokenData.instance_url}/services/data/v52.0/sobjects/Account/${accountResult.id}`,
        created_at: new Date().toISOString()
      },
      account_data: {
        name: company,
        phone: phone,
        website: website,
        industry: industry,
        revenue: annualRevenue,
        employees: numberOfEmployees
      },
      proof: {
        salesforce_id: accountResult.id,
        instance: tokenData.instance_url,
        integration_type: 'CLIENT_CREDENTIALS_REAL'
      }
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Unexpected error during Salesforce integration',
      error: error.message,
      stack: error.stack
    });
  }
});

/**
 * Test de conexión REAL
 * GET /api/salesforce/real/test-connection
 */
router.get('/real/test-connection', async (req, res) => {
  try {
    console.log('🔍 Testing REAL Salesforce connection...');
    
    const authUrl = 'https://login.salesforce.com/services/oauth2/token';
    
    const tokenResponse = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.SALESFORCE_CLIENT_ID,
        client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Connection test failed:', errorText);
      
      return res.json({
        status: 'connection_failed',
        message: 'Cannot connect to Salesforce',
        error: errorText,
        debug: {
          client_id: process.env.SALESFORCE_CLIENT_ID?.substring(0, 20) + '...',
          has_secret: !!process.env.SALESFORCE_CLIENT_SECRET,
          auth_url: authUrl
        }
      });
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ REAL connection successful!');
    
    return res.json({
      status: 'connected',
      message: 'REAL Salesforce connection successful!',
      salesforce: {
        instance_url: tokenData.instance_url,
        token_type: tokenData.token_type,
        connection_type: 'CLIENT_CREDENTIALS_REAL'
      },
      ready_for_integration: true
    });

  } catch (error) {
    console.error('❌ Connection test error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error testing connection',
      error: error.message
    });
  }
});

export default router;
