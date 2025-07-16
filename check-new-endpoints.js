#!/usr/bin/env node

/**
 * Test específico para los nuevos endpoints templates y tags
 */

import https from 'https';
import { URL } from 'url';

const BASE_URL = 'https://backend-service-pu47.onrender.com';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const req = https.request({
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'GET',
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}

async function testNewEndpoints() {
  console.log('🔍 TESTING NEW ENDPOINTS AFTER 404 FIX');
  console.log('=' .repeat(50));
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log(`🕐 Time: ${new Date().toISOString()}\n`);
  
  const endpoints = [
    { path: '/api/templates/recent', name: 'Recent Templates' },
    { path: '/api/templates/popular', name: 'Popular Templates' }, 
    { path: '/api/tags/cloud', name: 'Tag Cloud' }
  ];

  let allPassed = true;

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Testing: ${endpoint.name}`);
      console.log(`   URL: ${BASE_URL}${endpoint.path}`);
      
      const response = await makeRequest(`${BASE_URL}${endpoint.path}`);
      
      if (response.status === 200) {
        try {
          const data = JSON.parse(response.data);
          const itemCount = Array.isArray(data) ? data.length : 'N/A';
          console.log(`   ✅ SUCCESS - Status: 200, Items: ${itemCount}`);
          
          if (Array.isArray(data) && data.length > 0) {
            console.log(`   📊 Sample data: ${JSON.stringify(data[0], null, 2).slice(0, 100)}...`);
          }
        } catch (parseError) {
          console.log(`   ⚠️ SUCCESS but parse error: ${parseError.message}`);
        }
      } else {
        console.log(`   ❌ FAILED - Status: ${response.status}`);
        console.log(`   📄 Response: ${response.data.slice(0, 200)}...`);
        allPassed = false;
      }
    } catch (error) {
      console.log(`   ❌ ERROR - ${error.message}`);
      allPassed = false;
    }
    console.log('');
  }

  console.log('=' .repeat(50));
  if (allPassed) {
    console.log('🎉 ALL ENDPOINTS WORKING! ');
    console.log('✅ Frontend should now load without TypeError');
    console.log('✅ Home page templates should display');
    console.log('✅ Tag cloud should be functional');
  } else {
    console.log('❌ Some endpoints still failing');
    console.log('💡 Check Render logs for deployment status');
  }
  console.log('=' .repeat(50));
}

testNewEndpoints().catch(console.error);
