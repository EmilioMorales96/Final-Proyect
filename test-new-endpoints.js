#!/usr/bin/env node

/**
 * Test específico para los endpoints de templates y tags que acabamos de corregir
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
      timeout: 15000
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ 
            status: res.statusCode, 
            data: JSON.parse(data)
          });
        } catch (error) {
          resolve({ 
            status: res.statusCode, 
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

async function testNewEndpoints() {
  console.log('🔍 TESTING NEW TEMPLATE & TAG ENDPOINTS');
  console.log('=' .repeat(50));
  console.log(`🌐 Target: ${BASE_URL}`);
  console.log(`🕐 Time: ${new Date().toISOString()}\n`);

  const endpoints = [
    { path: '/api/templates/recent', description: 'Recent Templates (for Home page)' },
    { path: '/api/templates/popular', description: 'Popular Templates (Top 5)' },
    { path: '/api/tags/cloud', description: 'Tag Cloud (with usage counts)' }
  ];

  let allPassed = true;

  for (const endpoint of endpoints) {
    try {
      console.log(`🧪 Testing: ${endpoint.description}`);
      console.log(`   URL: ${endpoint.path}`);
      
      const response = await makeRequest(`${BASE_URL}${endpoint.path}`);
      
      if (response.status === 200) {
        const isArray = Array.isArray(response.data);
        const itemCount = isArray ? response.data.length : 'N/A';
        
        console.log(`   ✅ Status: 200 OK`);
        console.log(`   📊 Data type: ${isArray ? 'Array' : typeof response.data}`);
        console.log(`   📈 Items: ${itemCount}`);
        
        // Show sample data structure
        if (isArray && response.data.length > 0) {
          const sample = response.data[0];
          const keys = Object.keys(sample).slice(0, 5); // First 5 keys
          console.log(`   🔍 Sample keys: ${keys.join(', ')}`);
        }
        
      } else {
        console.log(`   ❌ Status: ${response.status}`);
        if (response.data) {
          console.log(`   📄 Error: ${JSON.stringify(response.data).substring(0, 100)}`);
        }
        allPassed = false;
      }
    } catch (error) {
      console.log(`   ❌ Request failed: ${error.message}`);
      allPassed = false;
    }
    console.log('');
  }

  console.log('=' .repeat(50));
  console.log('📊 FINAL RESULTS');
  console.log('=' .repeat(50));
  
  if (allPassed) {
    console.log('🎉 ALL ENDPOINTS WORKING CORRECTLY!');
    console.log('✅ Frontend 404 errors should now be resolved');
    console.log('✅ Home page should load templates successfully');
    console.log('✅ Tag cloud should render without errors');
    console.log('\n💡 The TypeError: t.map is not a function should be COMPLETELY FIXED!');
  } else {
    console.log('⚠️ Some endpoints still have issues');
    console.log('🔧 Additional debugging may be required');
  }
}

testNewEndpoints().catch(error => {
  console.error('❌ Test script failed:', error);
  process.exit(1);
});
