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

export default router;
