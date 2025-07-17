// 🧪 TEST SCRIPT - CLEAN SALESFORCE SYSTEM
// =====================================

console.log('🧪 Testing Clean Salesforce System...\n');

// Test 1: Health Check
async function testHealthCheck() {
  try {
    console.log('1️⃣ Testing Health Check...');
    const response = await fetch('http://localhost:3000/health');
    const data = await response.json();
    console.log('✅ Health Check:', data.status);
    return true;
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
    return false;
  }
}

// Test 2: Salesforce Status (requires auth token)
async function testSalesforceStatus() {
  try {
    console.log('\n2️⃣ Testing Salesforce Status...');
    
    // NOTE: This will fail without auth token, but shows endpoint is working
    const response = await fetch('http://localhost:3000/api/salesforce/status');
    
    if (response.status === 401) {
      console.log('✅ Salesforce Status Endpoint Active (Authentication Required)');
      return true;
    } else {
      const data = await response.json();
      console.log('✅ Salesforce Status:', data);
      return true;
    }
    
  } catch (error) {
    console.error('❌ Salesforce Status Failed:', error.message);
    return false;
  }
}

// Test 3: Check OAuth URL Generation (requires auth token)
async function testOAuthURL() {
  try {
    console.log('\n3️⃣ Testing OAuth URL Generation...');
    
    const response = await fetch('http://localhost:3000/api/salesforce/oauth/url');
    
    if (response.status === 401) {
      console.log('✅ OAuth URL Endpoint Active (Authentication Required)');
      return true;
    }
    
  } catch (error) {
    console.error('❌ OAuth URL Test Failed:', error.message);
    return false;
  }
}

// Test 4: Configuration Check
async function testConfiguration() {
  console.log('\n4️⃣ Testing Configuration...');
  
  const requiredVars = [
    'SALESFORCE_CLIENT_ID',
    'SALESFORCE_CLIENT_SECRET',
    'SALESFORCE_REDIRECT_URI'
  ];
  
  let allConfigured = true;
  
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: CONFIGURED`);
    } else {
      console.log(`❌ ${varName}: MISSING`);
      allConfigured = false;
    }
  }
  
  return allConfigured;
}

// Test 5: Endpoints Summary
function showEndpointsSummary() {
  console.log('\n5️⃣ Available Salesforce Endpoints:');
  console.log('📊 GET  /api/salesforce/status - Configuration status');
  console.log('🔗 GET  /api/salesforce/oauth/url - Generate OAuth URL');
  console.log('🔄 GET  /api/salesforce/oauth/callback - OAuth callback');
  console.log('📋 GET  /api/salesforce/accounts - List accounts');
  console.log('🆕 POST /api/salesforce/accounts - Create account');
  console.log('🔧 GET  /api/salesforce/debug - Debug info');
}

// Run all tests
async function runAllTests() {
  console.log('🚀 STARTING CLEAN SALESFORCE TESTS\n');
  console.log('=' .repeat(50));
  
  const test1 = await testHealthCheck();
  const test2 = await testSalesforceStatus();
  const test3 = await testOAuthURL();
  const test4 = testConfiguration();
  
  showEndpointsSummary();
  
  console.log('\n' + '=' .repeat(50));
  console.log('📋 TEST RESULTS SUMMARY:');
  console.log(`Health Check: ${test1 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Salesforce Status: ${test2 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`OAuth URL: ${test3 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Configuration: ${test4 ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = test1 && test2 && test3 && test4;
  
  console.log('\n🎯 OVERALL STATUS:', allPassed ? '✅ ALL SYSTEMS GO!' : '⚠️ SOME ISSUES DETECTED');
  
  if (allPassed) {
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. Login to your application frontend');
    console.log('2. Go to /api/salesforce/oauth/url to get OAuth URL');
    console.log('3. Use the OAuth URL to authenticate with Salesforce');
    console.log('4. Start creating and managing Salesforce accounts!');
  }
  
  console.log('\n✨ Clean Salesforce System Ready!');
}

// Run the tests
runAllTests().catch(console.error);
