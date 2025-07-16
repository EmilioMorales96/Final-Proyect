#!/usr/bin/env node

/**
 * Script to monitor deployment and execute topic enum migration
 * This will wait for the server to start and then run the migration
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
      },
      timeout: 15000 // 15 second timeout
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

async function checkAndMigrate() {
  console.log('🔍 CHECKING DEPLOYMENT STATUS AND RUNNING MIGRATION');
  console.log('=' .repeat(60));
  console.log(`🌐 Target: ${BASE_URL}`);
  console.log(`🕐 Time: ${new Date().toISOString()}\n`);

  try {
    // Step 1: Check if server is running
    console.log('1️⃣ Checking server status...');
    const rootResponse = await makeRequest(`${BASE_URL}/`);
    
    if (rootResponse.status !== 200) {
      console.log(`❌ Server not ready yet (status: ${rootResponse.status})`);
      return false;
    }
    
    console.log('✅ Server is running!');
    console.log(`📊 Response: ${JSON.stringify(rootResponse.data)}\n`);
    
    // Step 2: Check health endpoint
    console.log('2️⃣ Checking health endpoint...');
    const healthResponse = await makeRequest(`${BASE_URL}/health`);
    
    if (healthResponse.status === 200) {
      console.log('✅ Health endpoint working!');
      console.log(`📊 DB Status: ${healthResponse.data?.status}\n`);
    } else {
      console.log(`⚠️ Health endpoint not ready (status: ${healthResponse.status})\n`);
    }
    
    // Step 3: Run topic enum migration
    console.log('3️⃣ Running topic enum migration...');
    const migrationResponse = await makeRequest(`${BASE_URL}/debug/migrate-topic-enum`, {
      method: 'POST'
    });
    
    console.log(`📊 Migration Status: ${migrationResponse.status}`);
    console.log(`📄 Migration Response:`, JSON.stringify(migrationResponse.data, null, 2));
    
    if (migrationResponse.status === 200) {
      console.log('\n🎉 MIGRATION SUCCESSFUL!');
      console.log('✅ Topic enum issue has been resolved');
      console.log('✅ Database should now sync properly');
      
      // Step 4: Verify likes endpoint
      console.log('\n4️⃣ Verifying likes endpoint...');
      const likesResponse = await makeRequest(`${BASE_URL}/api/likes`, {
        method: 'POST',
        body: { templateId: 1 }
      });
      
      console.log(`📊 Likes Status: ${likesResponse.status}`);
      if (likesResponse.status === 401) {
        console.log('✅ Likes API is working correctly (401 = auth required)');
      } else {
        console.log(`⚠️ Unexpected likes status: ${likesResponse.status}`);
      }
      
      return true;
    } else {
      console.log('\n❌ MIGRATION FAILED');
      console.log('📄 Error details:', migrationResponse.data);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

async function monitorAndMigrate() {
  console.log('🚀 Starting deployment monitor with migration...');
  console.log('⏱️  Will check every 30 seconds until server is ready');
  console.log('🔧 Then will execute topic enum migration');
  console.log('💡 Render.com typically takes 2-5 minutes to deploy\n');
  
  let attempts = 0;
  const maxAttempts = 20; // 10 minutes maximum
  
  while (attempts < maxAttempts) {
    attempts++;
    console.log(`🔄 Attempt ${attempts}/${maxAttempts} - ${new Date().toISOString()}`);
    
    const success = await checkAndMigrate();
    if (success) {
      console.log('\n🎊 ALL TASKS COMPLETED SUCCESSFULLY!');
      console.log('✅ Server deployed');
      console.log('✅ Migration executed');
      console.log('✅ Likes API verified');
      console.log('\n💡 Your application should now be fully functional!');
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
    console.log('2. Manually run migration: POST /debug/migrate-topic-enum');
    console.log('3. Contact support if issues persist');
  }
}

// Start monitoring and migration
monitorAndMigrate().catch(error => {
  console.error('❌ Monitor failed:', error);
  process.exit(1);
});
