import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkRealIntegrations() {
  console.log('🎯 CHECKING REAL INTEGRATIONS - NO SIMULATIONS ALLOWED\n');
  console.log('=' .repeat(60));

  let allGood = true;

  // 1. Check Dropbox (WORKING)
  console.log('\n📦 DROPBOX INTEGRATION (REAL)');
  console.log('-'.repeat(40));
  
  if (process.env.DROPBOX_ACCESS_TOKEN) {
    try {
      const dropboxResponse = await fetch('https://api.dropboxapi.com/2/users/get_current_account', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (dropboxResponse.ok) {
        const userData = await dropboxResponse.json();
        console.log('✅ Dropbox: REAL INTEGRATION WORKING');
        console.log(`👤 Account: ${userData.name.display_name}`);
        console.log(`📧 Email: ${userData.email}`);
      } else {
        console.log('❌ Dropbox: AUTHENTICATION FAILED');
        allGood = false;
      }
    } catch (error) {
      console.log('❌ Dropbox: CONNECTION ERROR');
      allGood = false;
    }
  } else {
    console.log('❌ Dropbox: NOT CONFIGURED');
    allGood = false;
  }

  // 2. Check Salesforce (NEEDS TO BE REAL)
  console.log('\n⚡ SALESFORCE INTEGRATION (MUST BE REAL)');
  console.log('-'.repeat(40));
  
  if (process.env.SALESFORCE_CLIENT_ID && process.env.SALESFORCE_CLIENT_SECRET) {
    try {
      console.log('🔐 Testing REAL Salesforce authentication...');
      
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
        console.log('✅ Salesforce: REAL INTEGRATION WORKING');
        console.log(`📍 Instance URL: ${tokenData.instance_url}`);
        console.log(`🔑 Token Type: ${tokenData.token_type}`);
        
        // Test creating a real account
        console.log('🧪 Testing REAL account creation...');
        
        const testAccountData = {
          Name: `Test Company ${Date.now()}`,
          Type: 'Prospect',
          Description: 'Real test account for video demo',
          LeadSource: 'Forms App Test'
        };

        const accountResponse = await fetch(`${tokenData.instance_url}/services/data/v52.0/sobjects/Account/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testAccountData)
        });

        if (accountResponse.ok) {
          const accountResult = await accountResponse.json();
          console.log('✅ REAL Account Creation: SUCCESS');
          console.log(`🆔 Account ID: ${accountResult.id}`);
          console.log(`🔗 Salesforce URL: ${tokenData.instance_url}/lightning/r/Account/${accountResult.id}/view`);
        } else {
          const errorData = await accountResponse.json();
          console.log('❌ REAL Account Creation: FAILED');
          console.log('Error:', JSON.stringify(errorData, null, 2));
          allGood = false;
        }
        
      } else {
        const errorData = await tokenResponse.text();
        console.log('❌ Salesforce: AUTHENTICATION FAILED');
        console.log('Error:', errorData);
        console.log('\n💡 TO FIX:');
        console.log('1. Create Connected App in Salesforce Setup');
        console.log('2. Enable Client Credentials Flow');
        console.log('3. Copy Consumer Key/Secret to .env');
        console.log('4. Follow SALESFORCE_CONFIGURATION_GUIDE.md');
        allGood = false;
      }
    } catch (error) {
      console.log('❌ Salesforce: CONNECTION ERROR');
      console.log('Error:', error.message);
      allGood = false;
    }
  } else {
    console.log('❌ Salesforce: NOT CONFIGURED');
    console.log('\n💡 SETUP REQUIRED:');
    console.log('- SALESFORCE_CLIENT_ID not set');
    console.log('- SALESFORCE_CLIENT_SECRET not set');
    console.log('- Follow SALESFORCE_CONFIGURATION_GUIDE.md');
    allGood = false;
  }

  // 3. Check Backend Server
  console.log('\n🖥️ BACKEND SERVER');
  console.log('-'.repeat(40));

  try {
    const serverResponse = await fetch('http://localhost:3000/api/health');
    if (serverResponse.ok) {
      console.log('✅ Backend Server: RUNNING');
    } else {
      console.log('❌ Backend Server: NOT RESPONDING');
      console.log('💡 Start with: npm run dev');
      allGood = false;
    }
  } catch (error) {
    console.log('❌ Backend Server: NOT RUNNING');
    console.log('💡 Start with: npm run dev');
    allGood = false;
  }

  // FINAL RESULT
  console.log('\n🎬 VIDEO DEMO READINESS CHECK');
  console.log('=' .repeat(60));
  
  if (allGood) {
    console.log('🎉 ALL INTEGRATIONS ARE REAL AND WORKING!');
    console.log('✅ Ready for video recording');
    console.log('✅ No simulations detected');
    console.log('✅ All integrations are functional');
    console.log('\n🎯 YOUR APP IS 100% FUNCTIONAL FOR DEMO!');
  } else {
    console.log('❌ SETUP REQUIRED BEFORE VIDEO');
    console.log('⚠️ Some integrations need configuration');
    console.log('📋 Follow the setup guides to fix issues');
    console.log('\n🔧 Fix the issues above, then run this test again');
  }

  console.log('\n📝 INTEGRATION STATUS:');
  console.log(`Dropbox (Power Automate): ${process.env.DROPBOX_ACCESS_TOKEN ? '✅ REAL' : '❌ NEEDS SETUP'}`);
  console.log(`Salesforce: ${(process.env.SALESFORCE_CLIENT_ID && process.env.SALESFORCE_CLIENT_SECRET) ? '✅ CONFIGURED (check auth above)' : '❌ NEEDS SETUP'}`);
  console.log(`Backend: Check manually above`);
  
  return allGood;
}

// Run the check
checkRealIntegrations()
  .then(success => {
    console.log(success ? '\n🚀 READY FOR VIDEO!' : '\n🔧 SETUP NEEDED');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n💥 Error during check:', error);
    process.exit(1);
  });
