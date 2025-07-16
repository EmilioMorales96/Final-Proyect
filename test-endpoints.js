#!/usr/bin/env node

/**
 * Quick test script to verify the 404 endpoints are now working
 */

import https from 'https';
import { URL } from 'url';

const BASE_URL = 'https://backend-service-pu47.onrender.com';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      timeout: 15000
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data
        });
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

async function testEndpoints() {
  console.log('🔍 TESTING 404 ENDPOINT FIXES');
  console.log('=' .repeat(50));
  console.log(`🌐 Target: ${BASE_URL}`);
  console.log(`🕐 Time: ${new Date().toISOString()}\n`);

  const endpoints = [
    '/api/templates/recent',
    '/api/templates/popular', 
    '/api/tags/cloud'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      const response = await makeRequest(`${BASE_URL}${endpoint}`);
      
      if (response.status === 200) {
        const data = JSON.parse(response.data);
        console.log(`✅ ${endpoint} - Status: 200, Data length: ${Array.isArray(data) ? data.length : 'N/A'}`);
      } else {
        console.log(`❌ ${endpoint} - Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
    console.log('');
  }
}

// Wait a bit for deployment and then test
console.log('⏳ Waiting 60 seconds for deployment to complete...\n');
setTimeout(() => {
  testEndpoints().catch(console.error);
}, 60000);
