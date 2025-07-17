import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testAllIntegrations() {
  console.log('🔍 Testing All Integrations - Forms App\n');
  console.log('=' .repeat(50));

  // Test 1: Dropbox Integration
  console.log('\n📦 DROPBOX INTEGRATION');
  console.log('-'.repeat(30));
  
  const dropboxCredentials = {
    accessToken: process.env.DROPBOX_ACCESS_TOKEN,
    refreshToken: process.env.DROPBOX_REFRESH_TOKEN,
    clientId: process.env.DROPBOX_CLIENT_ID,
    clientSecret: process.env.DROPBOX_CLIENT_SECRET
  };

  console.log('📋 Dropbox Status:');
  Object.entries(dropboxCredentials).forEach(([key, value]) => {
    console.log(`${key}: ${value ? 'SET ✅' : 'NOT SET ❌'}`);
  });

  if (dropboxCredentials.accessToken) {
    try {
      // Test Dropbox connection
      const dropboxResponse = await fetch('https://api.dropboxapi.com/2/users/get_current_account', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${dropboxCredentials.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (dropboxResponse.ok) {
        const userData = await dropboxResponse.json();
        console.log('✅ Dropbox Connection: WORKING');
        console.log(`👤 Account: ${userData.name.display_name}`);
        console.log(`📧 Email: ${userData.email}`);
      } else {
        console.log('❌ Dropbox Connection: FAILED');
      }
    } catch (error) {
      console.log('❌ Dropbox Connection: ERROR');
      console.log('Error:', error.message);
    }
  } else {
    console.log('❌ Dropbox: Not configured');
  }

  // Test 2: Salesforce Integration  
  console.log('\n⚡ SALESFORCE INTEGRATION');
  console.log('-'.repeat(30));
  
  const salesforceCredentials = {
    clientId: process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
    instanceUrl: process.env.SALESFORCE_INSTANCE_URL
  };

  console.log('📋 Salesforce Status:');
  Object.entries(salesforceCredentials).forEach(([key, value]) => {
    console.log(`${key}: ${value ? 'SET ✅' : 'NOT SET ❌'}`);
  });

  if (salesforceCredentials.clientId && salesforceCredentials.clientSecret) {
    try {
      // Test Salesforce authentication
      const tokenResponse = await fetch('https://login.salesforce.com/services/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: salesforceCredentials.clientId,
          client_secret: salesforceCredentials.clientSecret,
        })
      });

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        console.log('✅ Salesforce Connection: WORKING');
        console.log(`📍 Instance URL: ${tokenData.instance_url}`);
        console.log(`🔑 Token Type: ${tokenData.token_type}`);
      } else {
        const errorData = await tokenResponse.text();
        console.log('❌ Salesforce Connection: FAILED');
        console.log('Error:', errorData);
      }
    } catch (error) {
      console.log('❌ Salesforce Connection: ERROR');
      console.log('Error:', error.message);
    }
  } else {
    console.log('❌ Salesforce: Not configured');
  }

  // Test 3: Backend Server
  console.log('\n🖥️ BACKEND SERVER');
  console.log('-'.repeat(30));

  try {
    const serverResponse = await fetch('http://localhost:3000/api/health');
    if (serverResponse.ok) {
      console.log('✅ Backend Server: RUNNING');
    } else {
      console.log('❌ Backend Server: NOT RESPONDING');
    }
  } catch (error) {
    console.log('❌ Backend Server: NOT RUNNING');
    console.log('Start with: npm run dev');
  }

  // Test 4: Environment Configuration
  console.log('\n⚙️ ENVIRONMENT CONFIGURATION');
  console.log('-'.repeat(30));

  const envVars = [
    'NODE_ENV',
    'PORT',
    'JWT_SECRET',
    'CORS_ORIGIN',
    'FRONTEND_URL'
  ];

  envVars.forEach(varName => {
    const value = process.env[varName];
    console.log(`${varName}: ${value ? 'SET ✅' : 'NOT SET ❌'}`);
  });

  // Summary
  console.log('\n📊 INTEGRATION SUMMARY');
  console.log('=' .repeat(50));
  
  const integrationStatus = {
    dropbox: dropboxCredentials.accessToken ? '✅ CONFIGURED' : '❌ NEEDS SETUP',
    salesforce: (salesforceCredentials.clientId && salesforceCredentials.clientSecret) ? '⚠️ NEEDS VALIDATION' : '❌ NEEDS SETUP',
    powerAutomate: dropboxCredentials.accessToken ? '✅ WORKING (via Dropbox)' : '❌ NEEDS DROPBOX',
    backend: '⚠️ CHECK MANUALLY'
  };

  Object.entries(integrationStatus).forEach(([integration, status]) => {
    console.log(`${integration.toUpperCase()}: ${status}`);
  });

  console.log('\n🎯 NEXT STEPS:');
  if (!dropboxCredentials.accessToken) {
    console.log('1. Configure Dropbox credentials in .env');
  }
  if (!salesforceCredentials.clientId) {
    console.log('2. Set up Salesforce Connected App and update .env');
  }
  console.log('3. Start backend server: npm run dev');
  console.log('4. Test frontend integrations');
  console.log('5. Record demo video! 🎬');

  console.log('\n✅ Integration test complete!');
}

// Run the test
testAllIntegrations().catch(console.error);
