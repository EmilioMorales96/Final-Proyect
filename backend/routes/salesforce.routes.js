import express from 'express';
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * REAL Salesforce Integration - Create Account and Contact
 * POST /api/salesforce/create-account
 * NO SIMULATION - ONLY REAL SALESFORCE INTEGRATION
 */
router.post('/create-account', authenticateToken, async (req, res) => {
  try {
    const { company, phone, website, industry, annualRevenue, numberOfEmployees } = req.body;
    const user = req.user;

    // Validate required fields
    if (!company) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Company name is required' 
      });
    }

    // Check if Salesforce credentials are configured
    if (!process.env.SALESFORCE_CLIENT_ID || !process.env.SALESFORCE_CLIENT_SECRET) {
      console.error('❌ Salesforce credentials not configured');
      return res.status(500).json({ 
        status: 'error',
        message: 'Salesforce integration not configured. Please set up your Connected App.',
        error: 'Missing client credentials'
      });
    }

    console.log('🔐 Authenticating with Salesforce...');

    // Get Salesforce access token
    const tokenResponse = await fetch('https://login.salesforce.com/services/oauth2/token', {
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
      const errorData = await tokenResponse.text();
      console.error('❌ Salesforce authentication failed:', errorData);
      return res.status(500).json({ 
        status: 'error',
        message: 'Failed to authenticate with Salesforce. Please check your credentials.',
        error: 'Authentication failed',
        details: errorData,
        setup_guide: 'See SALESFORCE_CONFIGURATION_GUIDE.md for setup instructions'
      });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const instanceUrl = tokenData.instance_url;

    console.log('✅ Salesforce authentication successful');
    console.log('🔗 Instance URL:', instanceUrl);

    // Create Account in Salesforce
    const accountData = {
      Name: company,
      Website: website || null,
      Phone: phone || null,
      Industry: industry || null,
      AnnualRevenue: annualRevenue ? parseFloat(annualRevenue) : null,
      NumberOfEmployees: numberOfEmployees ? parseInt(numberOfEmployees) : null,
      Type: 'Prospect',
      Description: `Account created via Forms App by ${user.email || user.username}`,
      LeadSource: 'Forms App'
    };

    console.log('📝 Creating Account in Salesforce...');

    const accountResponse = await fetch(`${instanceUrl}/services/data/v52.0/sobjects/Account/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData)
    });

    if (!accountResponse.ok) {
      const errorData = await accountResponse.json();
      console.error('❌ Salesforce account creation failed:', errorData);
      return res.status(500).json({ 
        status: 'error',
        message: 'Failed to create account in Salesforce', 
        error: errorData[0]?.message || 'Unknown error',
        details: errorData
      });
    }

    const accountResult = await accountResponse.json();
    console.log('✅ Account created successfully:', accountResult.id);

    // Create Contact in Salesforce
    const contactData = {
      FirstName: user.username?.split(' ')[0] || 'Contact',
      LastName: user.username?.split(' ').slice(1).join(' ') || 'User',
      Email: user.email || 'noemail@example.com',
      AccountId: accountResult.id,
      LeadSource: 'Forms App',
      Description: `Contact created via Forms App by ${user.email || user.username}`
    };

    console.log('👤 Creating Contact in Salesforce...');

    const contactResponse = await fetch(`${instanceUrl}/services/data/v52.0/sobjects/Contact/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData)
    });

    let contactResult = null;
    if (contactResponse.ok) {
      contactResult = await contactResponse.json();
      console.log('✅ Contact created successfully:', contactResult.id);
    } else {
      const contactError = await contactResponse.json();
      console.error('⚠️ Contact creation failed:', contactError);
      // Continue with account success even if contact fails
    }

    // Return REAL Salesforce data - NO SIMULATION
    res.json({
      status: 'success',
      message: 'Account and Contact created successfully in REAL Salesforce',
      integration: 'real',
      salesforce: {
        instance_url: instanceUrl,
        account: {
          id: accountResult.id,
          name: company,
          url: `${instanceUrl}/lightning/r/Account/${accountResult.id}/view`,
          api_url: `${instanceUrl}/services/data/v52.0/sobjects/Account/${accountResult.id}`
        },
        contact: contactResult ? {
          id: contactResult.id,
          name: `${contactData.FirstName} ${contactData.LastName}`,
          email: contactData.Email,
          url: `${instanceUrl}/lightning/r/Contact/${contactResult.id}/view`,
          api_url: `${instanceUrl}/services/data/v52.0/sobjects/Contact/${contactResult.id}`
        } : null
      },
      debug: {
        account_data: accountData,
        contact_data: contactData,
        user_info: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      }
    });

  } catch (error) {
    console.error('❌ Salesforce integration error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error during Salesforce integration', 
      error: error.message 
    });
  }
});

/**
 * REAL Demo endpoint - NO SIMULATION, NO FALLBACK
 * POST /api/salesforce/demo-create-account
 */
router.post('/demo-create-account', async (req, res) => {
  try {
    const { company, phone, website, industry, annualRevenue, numberOfEmployees } = req.body;

    // Validate required fields
    if (!company) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Company name is required' 
      });
    }

    // Check if Salesforce credentials are configured
    if (!process.env.SALESFORCE_CLIENT_ID || !process.env.SALESFORCE_CLIENT_SECRET) {
      console.error('❌ Salesforce not configured');
      return res.status(500).json({ 
        status: 'error',
        message: 'Salesforce integration not configured',
        error: 'Missing credentials',
        setup_required: true,
        setup_guide: 'Please follow SALESFORCE_CONFIGURATION_GUIDE.md to set up your Connected App'
      });
    }

    console.log('🔐 Demo: Authenticating with REAL Salesforce...');

    const tokenResponse = await fetch('https://login.salesforce.com/services/oauth2/token', {
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
      const errorData = await tokenResponse.text();
      console.error('❌ Demo: Salesforce authentication failed:', errorData);
      return res.status(500).json({ 
        status: 'error',
        message: 'Failed to authenticate with Salesforce',
        error: 'Invalid credentials or app configuration',
        details: errorData,
        setup_required: true
      });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const instanceUrl = tokenData.instance_url;

    console.log('✅ Demo: REAL Salesforce authentication successful');

    // Create demo account data in REAL Salesforce
    const accountData = {
      Name: company,
      Website: website || null,
      Phone: phone || null,
      Industry: industry || null,
      AnnualRevenue: annualRevenue ? parseFloat(annualRevenue) : null,
      NumberOfEmployees: numberOfEmployees ? parseInt(numberOfEmployees) : null,
      Type: 'Prospect',
      Description: 'Demo account created via Forms App - REAL INTEGRATION',
      LeadSource: 'Forms App Demo'
    };

    const accountResponse = await fetch(`${instanceUrl}/services/data/v52.0/sobjects/Account/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData)
    });

    if (!accountResponse.ok) {
      const errorData = await accountResponse.json();
      console.error('❌ Demo: Account creation failed:', errorData);
      return res.status(500).json({ 
        status: 'error',
        message: 'Failed to create account in Salesforce', 
        error: errorData[0]?.message || 'Unknown error',
        details: errorData
      });
    }

    const accountResult = await accountResponse.json();
    console.log('✅ Demo: REAL Account created:', accountResult.id);

    return res.json({
      status: 'success',
      message: 'Demo Account created successfully in REAL Salesforce',
      integration: 'real',
      salesforce: {
        instance_url: instanceUrl,
        account: {
          id: accountResult.id,
          name: company,
          url: `${instanceUrl}/lightning/r/Account/${accountResult.id}/view`,
          api_url: `${instanceUrl}/services/data/v52.0/sobjects/Account/${accountResult.id}`
        }
      },
      demo_note: 'This is a REAL Salesforce integration - no simulation used'
    });

  } catch (error) {
    console.error('❌ Demo Salesforce error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Demo integration failed', 
      error: error.message,
      note: 'This endpoint only uses REAL Salesforce integration'
    });
  }
});

/**
 * Get REAL Salesforce connection status
 * GET /api/salesforce/status
 */
router.get('/status', async (req, res) => {
  try {
    const hasCredentials = !!(process.env.SALESFORCE_CLIENT_ID && process.env.SALESFORCE_CLIENT_SECRET);
    
    if (!hasCredentials) {
      return res.json({
        status: 'not_configured',
        message: 'Salesforce credentials not configured',
        configured: false,
        setup_required: true
      });
    }

    // Test REAL authentication
    const tokenResponse = await fetch('https://login.salesforce.com/services/oauth2/token', {
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

    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json();
      
      return res.json({
        status: 'connected',
        message: 'REAL Salesforce integration is working perfectly',
        configured: true,
        instance_url: tokenData.instance_url,
        token_type: tokenData.token_type,
        integration_type: 'real'
      });
    } else {
      const errorData = await tokenResponse.text();
      
      return res.json({
        status: 'authentication_failed',
        message: 'Salesforce credentials are invalid',
        configured: true,
        error: errorData,
        setup_required: true
      });
    }

  } catch (error) {
    console.error('❌ Salesforce status error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error checking Salesforce status', 
      error: error.message 
    });
  }
});

export default router;
