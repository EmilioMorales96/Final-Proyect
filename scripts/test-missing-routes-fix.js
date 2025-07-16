#!/usr/bin/env node

/**
 * Script to verify that missing API routes are now working
 * Tests the template and tag endpoints that were returning 404
 */

import https from 'https';
import { URL } from 'url';

const BASE_URL = 'https://backend-service-pu47.onrender.com';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: 15000
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            data: data ? JSON.parse(data) : null
          };
          resolve(response);
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
            parseError: error.message
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function testMissingRoutes() {
  console.log('🔧 TESTING PREVIOUSLY MISSING API ROUTES');
  console.log('=' .repeat(60));
  console.log(`🌐 Target: ${BASE_URL}`);
  console.log(`🕐 Time: ${new Date().toISOString()}\n`);

  const endpointsToTest = [
    {
      name: 'Recent Templates',
      url: '/api/templates/recent',
      expectedStatus: 200
    },
    {
      name: 'Popular Templates', 
      url: '/api/templates/popular',
      expectedStatus: 200
    },
    {
      name: 'Tag Cloud',
      url: '/api/tags/cloud',
      expectedStatus: 200
    }
  ];

  let allPassed = true;

  for (const endpoint of endpointsToTest) {
    try {
      console.log(`🧪 Testing ${endpoint.name}...`);
      console.log(`   URL: ${endpoint.url}`);
      
      const response = await makeRequest(`${BASE_URL}${endpoint.url}`);
      
      if (response.status === endpoint.expectedStatus) {
        console.log(`   ✅ SUCCESS - Status: ${response.status}`);
        
        if (response.data) {
          if (Array.isArray(response.data)) {
            console.log(`   📊 Data: Array with ${response.data.length} items`);
            if (response.data.length > 0) {
              console.log(`   🔍 Sample: ${JSON.stringify(response.data[0], null, 2).substring(0, 100)}...`);
            }
          } else {
            console.log(`   📊 Data: ${JSON.stringify(response.data).substring(0, 100)}...`);
          }
        }
      } else {
        console.log(`   ❌ FAILED - Expected: ${endpoint.expectedStatus}, Got: ${response.status}`);
        console.log(`   📄 Response: ${JSON.stringify(response.data)}`);
        allPassed = false;
      }
      
    } catch (error) {
      console.log(`   ❌ ERROR - ${error.message}`);
      allPassed = false;
    }
    
    console.log(''); // Empty line for readability
  }

  // Test server health
  try {
    console.log('🏥 Testing server health...');
    const healthResponse = await makeRequest(`${BASE_URL}/health`);
    
    if (healthResponse.status === 200) {
      console.log('   ✅ Server health OK');
      console.log(`   📊 DB Status: ${healthResponse.data?.status}`);
    } else {
      console.log(`   ⚠️ Health check returned: ${healthResponse.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Health check failed: ${error.message}`);
  }

  console.log('\n' + '=' .repeat(60));
  
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ All previously missing routes are now working');
    console.log('✅ Frontend should now load without 404 errors');
    console.log('✅ Template and tag data available');
    return true;
  } else {
    console.log('❌ SOME TESTS FAILED');
    console.log('⚠️ Some endpoints may still be missing or broken');
    console.log('💡 Check server logs for more details');
    return false;
  }
}

async function monitorRoutesFix() {
  console.log('🚀 Starting missing routes fix monitor...');
  console.log('⏱️  Will check every 30 seconds until routes are available');
  console.log('🔧 Testing fix for 404 errors on template and tag endpoints');
  console.log('💡 Render.com typically takes 2-5 minutes to deploy\n');
  
  let attempts = 0;
  const maxAttempts = 20; // 10 minutes maximum
  
  while (attempts < maxAttempts) {
    attempts++;
    console.log(`🔄 Attempt ${attempts}/${maxAttempts} - ${new Date().toISOString()}`);
    
    const success = await testMissingRoutes();
    if (success) {
      console.log('\n🎊 ROUTES FIX VERIFICATION SUCCESSFUL!');
      console.log('✅ Backend deployment completed');
      console.log('✅ All API routes now accessible');
      console.log('✅ Template and tag endpoints working');
      console.log('\n💡 Frontend should now load all data correctly!');
      break;
    }
    
    if (attempts < maxAttempts) {
      console.log(`⏳ Waiting 30 seconds before next attempt...\n`);
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
  
  if (attempts >= maxAttempts) {
    console.log('\n⚠️ Timeout reached. You may need to:');
    console.log('1. Check Render dashboard for deployment status');
    console.log('2. Verify route imports in app.js');
    console.log('3. Check server logs for startup errors');
  }
}

// Start monitoring
monitorRoutesFix().catch(error => {
  console.error('❌ Monitor failed:', error);
  process.exit(1);
});
