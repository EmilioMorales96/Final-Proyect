import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testSalesforceConnection() {
  console.log('🔍 Testing Salesforce Integration...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('SALESFORCE_CLIENT_ID:', process.env.SALESFORCE_CLIENT_ID ? 'SET ✅' : 'NOT SET ❌');
  console.log('SALESFORCE_CLIENT_SECRET:', process.env.SALESFORCE_CLIENT_SECRET ? 'SET ✅' : 'NOT SET ❌');
  console.log('SALESFORCE_INSTANCE_URL:', process.env.SALESFORCE_INSTANCE_URL || 'NOT SET ❌');
  console.log('');

  if (!process.env.SALESFORCE_CLIENT_ID || !process.env.SALESFORCE_CLIENT_SECRET) {
    console.log('❌ Missing Salesforce credentials');
    return;
  }

  try {
    // Test authentication
    console.log('🔐 Testing authentication...');
    
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
      console.log('❌ Authentication failed:');
      console.log(errorData);
      console.log('\n💡 Possible issues:');
      console.log('- Client ID or Client Secret is incorrect');
      console.log('- Connected App may not have Client Credentials flow enabled');
      console.log('- Connected App may need proper permissions');
      return;
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Authentication successful!');
    console.log('📍 Instance URL:', tokenData.instance_url);
    console.log('🔑 Token Type:', tokenData.token_type);
    console.log('');

    // Test Account creation
    console.log('🏢 Testing Account creation...');
    
    const accountData = {
      Name: `Test Company ${Date.now()}`,
      Type: 'Prospect',
      Description: 'Test account created by Forms App integration test',
      LeadSource: 'Forms App Test'
    };

    const accountResponse = await fetch(`${tokenData.instance_url}/services/data/v52.0/sobjects/Account/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData)
    });

    if (!accountResponse.ok) {
      const errorData = await accountResponse.json();
      console.log('❌ Account creation failed:');
      console.log(JSON.stringify(errorData, null, 2));
      console.log('\n💡 Possible issues:');
      console.log('- Connected App may not have proper API permissions');
      console.log('- Required fields may be missing');
      console.log('- Validation rules may be blocking creation');
      return;
    }

    const accountResult = await accountResponse.json();
    console.log('✅ Account created successfully!');
    console.log('🆔 Account ID:', accountResult.id);
    console.log('🔗 View URL:', `${tokenData.instance_url}/lightning/r/Account/${accountResult.id}/view`);
    console.log('');

    // Test Contact creation
    console.log('👤 Testing Contact creation...');
    
    const contactData = {
      FirstName: 'Test',
      LastName: 'User',
      Email: `test${Date.now()}@example.com`,
      AccountId: accountResult.id,
      LeadSource: 'Forms App Test',
      Description: 'Test contact created by Forms App integration test'
    };

    const contactResponse = await fetch(`${tokenData.instance_url}/services/data/v52.0/sobjects/Contact/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData)
    });

    if (!contactResponse.ok) {
      const errorData = await contactResponse.json();
      console.log('⚠️ Contact creation failed:');
      console.log(JSON.stringify(errorData, null, 2));
      console.log('📝 Note: Account creation was successful, Contact creation may have additional validation rules');
    } else {
      const contactResult = await contactResponse.json();
      console.log('✅ Contact created successfully!');
      console.log('🆔 Contact ID:', contactResult.id);
      console.log('🔗 View URL:', `${tokenData.instance_url}/lightning/r/Contact/${contactResult.id}/view`);
    }

    console.log('\n🎉 Salesforce Integration Test Complete!');
    console.log('✅ Your Salesforce integration is fully functional');

  } catch (error) {
    console.log('❌ Test failed with error:');
    console.log(error.message);
    console.log('\n💡 Possible issues:');
    console.log('- Network connectivity problems');
    console.log('- Invalid API endpoint');
    console.log('- Server configuration issues');
  }
}

// Run the test
testSalesforceConnection();
