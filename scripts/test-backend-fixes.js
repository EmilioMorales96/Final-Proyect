// Backend Fixes Verification Script
const BASE_URL = 'https://backend-service-pu47.onrender.com';

async function testEndpoints() {
  console.log('🔧 Testing Backend Fixes...\n');

  // Test health endpoint
  try {
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.status);
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
  }

  // Test if favorites route exists (should not return 404)
  try {
    const favResponse = await fetch(`${BASE_URL}/api/favorites/debug/test`);
    if (favResponse.status === 404) {
      console.log('❌ Favorites route still not found');
    } else {
      const favData = await favResponse.json();
      console.log('✅ Favorites route is working:', favData.message);
    }
  } catch (error) {
    console.log('❌ Favorites test failed:', error.message);
  }

  // Test tags GET endpoint
  try {
    const tagsResponse = await fetch(`${BASE_URL}/api/tags`);
    if (tagsResponse.status === 200) {
      console.log('✅ Tags GET endpoint working');
    } else {
      console.log('❌ Tags GET endpoint status:', tagsResponse.status);
    }
  } catch (error) {
    console.log('❌ Tags GET test failed:', error.message);
  }

  console.log('\n🎯 Note: POST endpoints require authentication, so 401/403 responses are expected');
  console.log('The important fix is that we should not get 404 errors anymore.\n');
}

// Run in Node.js environment
if (typeof window === 'undefined') {
  // Node.js
  import('node-fetch').then(({ default: fetch }) => {
    global.fetch = fetch;
    testEndpoints();
  }).catch(() => {
    console.log('❌ This script requires node-fetch package');
    console.log('Run: npm install node-fetch');
  });
} else {
  // Browser
  testEndpoints();
}
