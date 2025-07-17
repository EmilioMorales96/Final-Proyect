#!/usr/bin/env node

/**
 * Monitor Render Deployment Progress
 * Checks if OAuth routes are available every 30 seconds
 */

const PRODUCTION_URL = 'https://backend-service-pu47.onrender.com';
let attempt = 1;
const maxAttempts = 10; // 5 minutes total

async function checkDeployment() {
  console.log(`\n🔄 Attempt ${attempt}/${maxAttempts} - Checking deployment...`);
  
  try {
    // Quick test of new OAuth route
    const response = await fetch(`${PRODUCTION_URL}/api/salesforce/debug/config`, {
      method: 'GET'
    });
    
    if (response.ok) {
      const config = await response.json();
      console.log('✅ SUCCESS! OAuth routes are now deployed!');
      console.log('🌐 Environment:', config.environment);
      console.log('🔧 Default Redirect URI:', config.defaultRedirectUri);
      console.log('\n🎉 You can now test: https://backend-service-pu47.onrender.com/api/salesforce/oauth/authorize');
      return true;
    } else {
      console.log(`❌ Status: ${response.status} - Still deploying...`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message} - Still deploying...`);
    return false;
  }
}

async function monitorDeployment() {
  console.log('🚀 Monitoring Render deployment progress...');
  console.log('📅 Expected time: 2-5 minutes');
  
  while (attempt <= maxAttempts) {
    const success = await checkDeployment();
    
    if (success) {
      return;
    }
    
    attempt++;
    
    if (attempt <= maxAttempts) {
      console.log('⏳ Waiting 30 seconds before next check...');
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
  
  console.log('\n⏰ Timeout reached. The deployment might take longer than expected.');
  console.log('💡 Try testing manually in a few more minutes:');
  console.log('   https://backend-service-pu47.onrender.com/api/salesforce/oauth/authorize');
}

// Start monitoring
monitorDeployment().catch(console.error);
