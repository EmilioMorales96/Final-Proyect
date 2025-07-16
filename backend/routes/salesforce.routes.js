import express from 'express';
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * Salesforce Integration Routes
 * Handles creation of Salesforce Accounts and Contacts
 */

/**
 * Create Salesforce Account and Contact
 * POST /api/salesforce/create-account
 */
router.post('/create-account', authenticateToken, async (req, res) => {
  try {
    const { company, phone, website, industry, annualRevenue, numberOfEmployees } = req.body;
    const user = req.user;

    // Validate required fields
    if (!company) {
      return res.status(400).json({ message: 'Company name is required' });
    }

    // Get Salesforce access token
    const tokenResponse = await fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/oauth2/token`, {
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
      console.error('Salesforce token error:', errorData);
      return res.status(500).json({ message: 'Failed to authenticate with Salesforce' });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Create Account in Salesforce
    const accountData = {
      Name: company,
      Website: website || null,
      Industry: industry || null,
      AnnualRevenue: annualRevenue ? parseFloat(annualRevenue) : null,
      NumberOfEmployees: numberOfEmployees || null,
      Type: 'Customer',
      Description: `Account created from Forms App by user ${user.id}`
    };

    const accountResponse = await fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/data/v57.0/sobjects/Account`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData)
    });

    if (!accountResponse.ok) {
      const errorData = await accountResponse.json();
      console.error('Salesforce account creation error:', errorData);
      return res.status(500).json({ message: 'Failed to create Salesforce account' });
    }

    const accountResult = await accountResponse.json();
    const accountId = accountResult.id;

    // Create Contact in Salesforce
    const contactData = {
      FirstName: user.username?.split(' ')[0] || 'User',
      LastName: user.username?.split(' ').slice(1).join(' ') || user.id.toString(),
      Email: user.email || null,
      Phone: phone || null,
      AccountId: accountId,
      Description: `Contact created from Forms App for user ${user.id}`
    };

    const contactResponse = await fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/data/v57.0/sobjects/Contact`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData)
    });

    if (!contactResponse.ok) {
      const errorData = await contactResponse.json();
      console.error('Salesforce contact creation error:', errorData);
      return res.status(500).json({ message: 'Failed to create Salesforce contact' });
    }

    const contactResult = await contactResponse.json();

    res.json({
      message: 'Successfully created Salesforce account and contact',
      accountId: accountResult.id,
      contactId: contactResult.id
    });

  } catch (error) {
    console.error('Salesforce integration error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

/**
 * Get Salesforce sync statistics
 * GET /api/salesforce/stats
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get access token
    const tokenResponse = await fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/oauth2/token`, {
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
      return res.status(500).json({ message: 'Failed to authenticate with Salesforce' });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Query Salesforce for statistics
    const accountsQuery = `SELECT COUNT() FROM Account WHERE Description LIKE '%Forms App%'`;
    const contactsQuery = `SELECT COUNT() FROM Contact WHERE Description LIKE '%Forms App%'`;
    const industryQuery = `SELECT Industry, COUNT(Id) total FROM Account WHERE Description LIKE '%Forms App%' AND Industry != null GROUP BY Industry LIMIT 10`;

    const [accountsResult, contactsResult, industryResult] = await Promise.all([
      fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/data/v57.0/query/?q=${encodeURIComponent(accountsQuery)}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }),
      fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/data/v57.0/query/?q=${encodeURIComponent(contactsQuery)}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }),
      fetch(`${process.env.SALESFORCE_INSTANCE_URL}/services/data/v57.0/query/?q=${encodeURIComponent(industryQuery)}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
    ]);

    const [accountsData, contactsData, industryData] = await Promise.all([
      accountsResult.json(),
      contactsResult.json(),
      industryResult.json()
    ]);

    const totalAccounts = accountsData.totalSize || 0;
    const totalContacts = contactsData.totalSize || 0;
    const industries = industryData.records?.map(record => ({
      name: record.Industry,
      count: record.total
    })) || [];

    res.json({
      stats: {
        totalAccounts,
        totalContacts,
        syncedForms: totalAccounts, // Assuming each account represents a synced form
        successRate: totalAccounts > 0 ? Math.round((totalContacts / totalAccounts) * 100) : 0,
        leadSources: {
          forms: totalAccounts,
          direct: 0
        },
        industries
      }
    });

  } catch (error) {
    console.error('Salesforce stats error:', error);
    res.status(500).json({ message: 'Failed to fetch Salesforce statistics' });
  }
});

/**
 * Get sync history (mock implementation)
 * GET /api/salesforce/sync-history
 */
router.get('/sync-history', authenticateToken, async (req, res) => {
  try {
    // This would typically come from a database
    // For now, we'll return mock data
    const mockHistory = [
      {
        type: 'Form Sync',
        status: 'success',
        timestamp: new Date().toISOString(),
        count: 5
      },
      {
        type: 'Account Creation',
        status: 'success', 
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        count: 3
      }
    ];

    res.json({ history: mockHistory });
  } catch (error) {
    console.error('Sync history error:', error);
    res.status(500).json({ message: 'Failed to fetch sync history' });
  }
});

/**
 * Sync all forms to Salesforce
 * POST /api/salesforce/sync-all-forms
 */
router.post('/sync-all-forms', authenticateToken, async (req, res) => {
  try {
    // This is a placeholder for bulk sync functionality
    // In a real implementation, you would:
    // 1. Fetch all form responses from your database
    // 2. Create Salesforce Accounts/Contacts for each
    // 3. Track the sync progress

    res.json({ 
      message: 'Sync initiated',
      synced: 0, // Would be the actual count
      status: 'completed'
    });

  } catch (error) {
    console.error('Bulk sync error:', error);
    res.status(500).json({ message: 'Failed to sync forms' });
  }
});

/**
 * OAuth Authorization Endpoint (Public - No Auth Required)
 * GET /api/salesforce/oauth/authorize
 */
router.get('/oauth/authorize', (req, res) => {
  const clientId = process.env.SALESFORCE_CLIENT_ID;
  const redirectUri = process.env.SALESFORCE_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/salesforce/oauth/callback`;
  
  // Debug logging
  console.log('🔧 OAuth Authorization Debug:');
  console.log('CLIENT_ID:', clientId ? 'SET' : 'NOT SET');
  console.log('REDIRECT_URI:', redirectUri);
  console.log('Environment:', process.env.NODE_ENV);
  
  if (!clientId) {
    return res.status(500).json({ 
      error: 'Configuration Error',
      message: 'SALESFORCE_CLIENT_ID not configured'
    });
  }
  
  const authUrl = `https://login.salesforce.com/services/oauth2/authorize?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=api%20refresh_token`;

  res.redirect(authUrl);
});

/**
 * OAuth Callback Endpoint (Public - No Auth Required)
 * GET /api/salesforce/oauth/callback
 */
router.get('/oauth/callback', async (req, res) => {
  try {
    const { code, error } = req.query;

    if (error) {
      console.error('OAuth error:', error);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/integrations?error=oauth_failed&details=${encodeURIComponent(error)}`);
    }

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/integrations?error=no_code`);
    }

    // Exchange code for access token
    const redirectUri = process.env.SALESFORCE_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/salesforce/oauth/callback`;
    
    const tokenResponse = await fetch('https://login.salesforce.com/services/oauth2/token', {
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

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange error:', errorData);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/integrations?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();
    
    // Here you would typically store the tokens in your database
    // For now, we'll just redirect with success
    
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/integrations?success=oauth_connected&instance=${encodeURIComponent(tokenData.instance_url)}`);

  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/integrations?error=callback_failed`);
  }
});

/**
 * Debug endpoint for Salesforce configuration (Public - No Auth Required)
 * GET /api/salesforce/debug/config
 */
router.get('/debug/config', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
    salesforce: {
      clientId: process.env.SALESFORCE_CLIENT_ID ? 'SET' : 'NOT SET',
      clientSecret: process.env.SALESFORCE_CLIENT_SECRET ? 'SET' : 'NOT SET',
      redirectUri: process.env.SALESFORCE_REDIRECT_URI || 'NOT SET',
      instanceUrl: process.env.SALESFORCE_INSTANCE_URL || 'NOT SET',
      frontendUrl: process.env.FRONTEND_URL || 'NOT SET'
    },
    host: req.get('host'),
    protocol: req.protocol
  });
});

/**
 * Check authentication status (Public - No Auth Required)
 * GET /api/salesforce/auth-check
 */
router.get('/auth-check', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.json({ 
      authenticated: false, 
      message: 'No token provided',
      needsLogin: true
    });
  }

  // Simple token presence check
  res.json({ 
    authenticated: true, 
    message: 'Token present - proceed with OAuth',
    needsLogin: false
  });
});

/**
 * Check OAuth Connection Status
 * GET /api/salesforce/oauth/status
 */
router.get('/oauth/status', authenticateToken, async (req, res) => {
  try {
    // Check if user has valid Salesforce tokens stored
    // This is a simplified version - you would check your database
    
    const hasValidTokens = !!(process.env.SALESFORCE_CLIENT_ID && process.env.SALESFORCE_CLIENT_SECRET);
    
    res.json({
      connected: hasValidTokens,
      configured: hasValidTokens,
      lastSync: new Date().toISOString()
    });
  } catch (error) {
    console.error('OAuth status error:', error);
    res.status(500).json({ message: 'Failed to check OAuth status' });
  }
});

export default router;
