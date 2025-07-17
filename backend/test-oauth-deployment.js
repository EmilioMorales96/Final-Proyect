#!/usr/bin/env node

/**
 * Test OAuth Route Deployment
 * Verifica que las rutas OAuth estén disponibles en producción
 */

const PRODUCTION_URL = 'https://backend-service-pu47.onrender.com';

async function testOAuthRoutes() {
  console.log('🔍 Testing OAuth Routes Deployment...\n');

  // Test 1: OAuth Authorize Route
  console.log('1️⃣ Testing OAuth Authorize Route:');
  try {
    const response = await fetch(`${PRODUCTION_URL}/api/salesforce/oauth/authorize`, {
      method: 'GET',
      redirect: 'manual' // Don't follow redirects
    });
    
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 302) {
      const location = response.headers.get('location');
      console.log('   ✅ Route working - Redirecting to:', location);
    } else if (response.status === 500) {
      const error = await response.json();
      console.log('   ⚠️ Route exists but configuration needed:', error.message);
    } else {
      console.log('   ❌ Unexpected response');
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  console.log('');

  // Test 2: Debug Config Route
  console.log('2️⃣ Testing Debug Config Route:');
  try {
    const response = await fetch(`${PRODUCTION_URL}/api/salesforce/debug/config`);
    
    console.log(`   Status: ${response.status}`);
    
    if (response.ok) {
      const config = await response.json();
      console.log('   ✅ Route working');
      console.log('   Environment:', config.environment);
      console.log('   Client ID:', config.salesforce.clientId);
      console.log('   Default Redirect URI:', config.defaultRedirectUri);
    } else {
      console.log('   ❌ Route not found');
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  console.log('');

  // Test 3: Salesforce Status Route
  console.log('3️⃣ Testing Salesforce Status Route:');
  try {
    const response = await fetch(`${PRODUCTION_URL}/api/salesforce/status`);
    
    console.log(`   Status: ${response.status}`);
    
    if (response.ok) {
      const status = await response.json();
      console.log('   ✅ Route working');
      console.log('   Salesforce Status:', status.status);
      console.log('   Integration Type:', status.integration_type || 'Not specified');
    } else {
      console.log('   ❌ Route not found');
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  console.log('\n🏁 OAuth Routes Test Complete!');
}

// Run the test
testOAuthRoutes().catch(console.error);
