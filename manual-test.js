#!/usr/bin/env node

/**
 * Manual test script para verificar que el fix de likes está funcionando
 * Ejecutar después de que el deployment esté completo
 */

import https from 'https';
import { URL } from 'url';

const BASE_URL = 'https://backend-service-pu47.onrender.com';

// Helper function to make HTTP requests
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
      }
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

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function manualTest() {
  console.log('🧪 MANUAL TEST - LIKES API FIX VERIFICATION\n');
  console.log('=' .repeat(60));

  try {
    // Test 1: Verify new health endpoint
    console.log('\n1️⃣ Testing Health Endpoint');
    console.log('---------------------------');
    const healthResponse = await makeRequest(`${BASE_URL}/health`);
    console.log(`Status: ${healthResponse.status}`);
    console.log('Response:', JSON.stringify(healthResponse.data, null, 2));
    
    if (healthResponse.status === 200) {
      console.log('✅ HEALTH ENDPOINT: Working correctly');
    } else {
      console.log('❌ HEALTH ENDPOINT: Not deployed yet');
    }

    // Test 2: Verify debug endpoint
    console.log('\n2️⃣ Testing Debug Endpoint'); 
    console.log('-------------------------');
    const debugResponse = await makeRequest(`${BASE_URL}/debug/likes`);
    console.log(`Status: ${debugResponse.status}`);
    console.log('Response:', JSON.stringify(debugResponse.data, null, 2));
    
    if (debugResponse.status === 200) {
      console.log('✅ DEBUG ENDPOINT: Working correctly');
    } else {
      console.log('❌ DEBUG ENDPOINT: Not deployed yet');
    }

    // Test 3: Verify likes endpoint behavior (without auth)
    console.log('\n3️⃣ Testing Likes Endpoint (No Auth)');
    console.log('-----------------------------------');
    const likesResponseNoAuth = await makeRequest(`${BASE_URL}/api/likes`, {
      method: 'POST',
      body: { templateId: 1 }
    });
    console.log(`Status: ${likesResponseNoAuth.status}`);
    console.log('Response:', JSON.stringify(likesResponseNoAuth.data, null, 2));
    
    if (likesResponseNoAuth.status === 401) {
      console.log('✅ LIKES ENDPOINT: Correctly requires authentication');
    } else if (likesResponseNoAuth.status === 500) {
      console.log('❌ LIKES ENDPOINT: Still returning 500 error - fix not deployed');
    } else {
      console.log(`⚠️ LIKES ENDPOINT: Unexpected status ${likesResponseNoAuth.status}`);
    }

    // Test 4: Test with missing templateId
    console.log('\n4️⃣ Testing Likes Endpoint (Missing templateId)');
    console.log('-----------------------------------------------');
    const likesResponseMissing = await makeRequest(`${BASE_URL}/api/likes`, {
      method: 'POST',
      body: {}
    });
    console.log(`Status: ${likesResponseMissing.status}`);
    console.log('Response:', JSON.stringify(likesResponseMissing.data, null, 2));
    
    if (likesResponseMissing.status === 401) {
      console.log('✅ VALIDATION: Auth middleware correctly blocks before validation');
    } else {
      console.log(`ℹ️ VALIDATION: Response status ${likesResponseMissing.status}`);
    }

    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 SUMMARY');
    console.log('=' .repeat(60));
    
    const healthOk = healthResponse.status === 200;
    const debugOk = debugResponse.status === 200;
    const likesOk = likesResponseNoAuth.status === 401; // Should be 401, not 500
    
    if (healthOk && debugOk && likesOk) {
      console.log('🎉 ALL TESTS PASSED!');
      console.log('✅ Deployment is complete and likes API is fixed');
      console.log('✅ New endpoints are available');
      console.log('✅ Likes endpoint no longer returns 500 error');
    } else if (likesOk && !healthOk && !debugOk) {
      console.log('⚠️ PARTIAL SUCCESS');
      console.log('✅ Likes API is fixed (no more 500 error)');
      console.log('❌ New endpoints not deployed yet');
    } else if (!likesOk) {
      console.log('❌ DEPLOYMENT INCOMPLETE');
      console.log('❌ Likes API still returning 500 error');
      console.log('⏳ Please wait for deployment to complete');
    }

    console.log('\n💡 To check again later, run: node manual-test.js');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
manualTest();
