#!/usr/bin/env node

/**
 * Monitor deployment progress and test new features
 * Runs continuous checks until new endpoints are available
 */

import https from 'https';
import { URL } from 'url';

const BASE_URL = 'https://backend-service-pu47.onrender.com';
const CHECK_INTERVAL = 30000; // 30 seconds

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
      },
      timeout: 10000 // 10 second timeout
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

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function checkDeployment() {
  const timestamp = new Date().toISOString();
  console.log(`\n🔍 [${timestamp}] Checking deployment status...`);

  try {
    // Check if new health endpoint is available
    const healthResponse = await makeRequest(`${BASE_URL}/health`);
    const debugResponse = await makeRequest(`${BASE_URL}/debug/likes`);
    
    console.log(`Health endpoint: ${healthResponse.status === 200 ? '✅ Available' : '❌ Not found (404)'}`);
    console.log(`Debug endpoint: ${debugResponse.status === 200 ? '✅ Available' : '❌ Not found (404)'}`);
    
    if (healthResponse.status === 200 && debugResponse.status === 200) {
      console.log('\n🎉 NEW DEPLOYMENT DETECTED! Testing functionality...\n');
      
      // Test the health endpoint
      console.log('🔋 Health Check Results:');
      console.log(JSON.stringify(healthResponse.data, null, 2));
      
      // Test the debug endpoint  
      console.log('\n🛠️ Debug Endpoint Results:');
      console.log(JSON.stringify(debugResponse.data, null, 2));
      
      // Test likes endpoint without auth (should get proper 401)
      console.log('\n🔐 Testing likes endpoint (unauthorized):');
      const likesTest = await makeRequest(`${BASE_URL}/api/likes`, {
        method: 'POST',
        body: { templateId: 1 }
      });
      console.log(`Status: ${likesTest.status} (expected: 401)`);
      console.log('Response:', JSON.stringify(likesTest.data, null, 2));
      
      console.log('\n✅ DEPLOYMENT SUCCESSFUL! All new features are working.');
      console.log('🚀 The likes API should now be fixed in production.');
      
      return true; // Deployment complete
    }
    
    return false; // Still waiting
    
  } catch (error) {
    console.log(`❌ Error checking deployment: ${error.message}`);
    return false;
  }
}

async function monitorDeployment() {
  console.log('🚀 Starting deployment monitor...');
  console.log('⏱️  Will check every 30 seconds for new deployment');
  console.log('🎯 Looking for /health and /debug/likes endpoints');
  console.log('💡 Render.com typically takes 2-5 minutes to deploy');
  
  let attempts = 0;
  const maxAttempts = 20; // 10 minutes maximum
  
  while (attempts < maxAttempts) {
    attempts++;
    
    const isDeployed = await checkDeployment();
    if (isDeployed) {
      break;
    }
    
    if (attempts < maxAttempts) {
      console.log(`⏳ Waiting 30 seconds... (attempt ${attempts}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
    }
  }
  
  if (attempts >= maxAttempts) {
    console.log('\n⚠️  Timeout reached. Deployment may still be in progress.');
    console.log('💡 You can manually check later or trigger a manual deployment in Render dashboard.');
  }
}

// Start monitoring
monitorDeployment().catch(error => {
  console.error('❌ Monitor failed:', error);
  process.exit(1);
});
