#!/usr/bin/env node

/**
 * Quick deployment test script
 * Tests the deployed API endpoints and diagnoses issues
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

async function testDeployment() {
  console.log('🚀 Testing deployed backend...\n');

  try {
    // Test 1: Basic health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await makeRequest(`${BASE_URL}/health`);
    console.log(`Status: ${healthResponse.status}`);
    console.log(`Response:`, healthResponse.data);
    console.log('');

    // Test 2: Debug likes endpoint
    console.log('2️⃣ Testing debug likes endpoint...');
    const debugResponse = await makeRequest(`${BASE_URL}/debug/likes`);
    console.log(`Status: ${debugResponse.status}`);
    console.log(`Response:`, debugResponse.data);
    console.log('');

    // Test 3: Basic API root
    console.log('3️⃣ Testing API root...');
    const rootResponse = await makeRequest(`${BASE_URL}/`);
    console.log(`Status: ${rootResponse.status}`);
    console.log(`Response:`, rootResponse.data);
    console.log('');

    // Test 4: Test likes endpoint (without auth - should get 401)
    console.log('4️⃣ Testing likes endpoint (no auth)...');
    const likesResponse = await makeRequest(`${BASE_URL}/api/likes`, {
      method: 'POST',
      body: { templateId: 1 }
    });
    console.log(`Status: ${likesResponse.status}`);
    console.log(`Response:`, likesResponse.data);
    console.log('');

    console.log('✅ Deployment test completed!');

  } catch (error) {
    console.error('❌ Deployment test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testDeployment();
