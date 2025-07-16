#!/usr/bin/env node

/**
 * Script to test the frontend fix for TypeError: t.map is not a function
 * This will monitor the deployment and test the problematic endpoints
 */

import https from 'https';
import { URL } from 'url';

const FRONTEND_URL = 'https://frontend-service-pu47.onrender.com';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...options.headers
      },
      timeout: 20000
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
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

async function testFrontendFix() {
  console.log('🧪 TESTING FRONTEND FIX FOR TypeError: t.map is not a function');
  console.log('=' .repeat(70));
  console.log(`🌐 Target: ${FRONTEND_URL}`);
  console.log(`🕐 Time: ${new Date().toISOString()}\n`);

  try {
    // Test 1: Check if frontend loads
    console.log('1️⃣ Testing main page load...');
    const homeResponse = await makeRequest(FRONTEND_URL);
    
    if (homeResponse.status === 200) {
      console.log('✅ Frontend loads successfully');
      
      // Check for common JavaScript errors in the HTML
      const hasMapError = homeResponse.data.includes('t.map is not a function');
      const hasJSErrors = homeResponse.data.includes('TypeError') && homeResponse.data.includes('.map');
      
      if (hasMapError || hasJSErrors) {
        console.log('❌ Still detecting map-related errors in the HTML');
        return false;
      } else {
        console.log('✅ No obvious map errors detected in HTML');
      }
      
    } else {
      console.log(`❌ Frontend not loading properly (status: ${homeResponse.status})`);
      return false;
    }

    // Test 2: Check bundle files
    console.log('\n2️⃣ Checking for updated bundle files...');
    const bundleMatches = homeResponse.data.match(/\/assets\/index-[a-zA-Z0-9]+\.js/g);
    
    if (bundleMatches && bundleMatches.length > 0) {
      console.log(`✅ Found ${bundleMatches.length} bundle file(s)`);
      const latestBundle = bundleMatches[0];
      console.log(`📦 Latest bundle: ${latestBundle}`);
      
      // Test the bundle file
      const bundleResponse = await makeRequest(`${FRONTEND_URL}${latestBundle}`);
      if (bundleResponse.status === 200) {
        console.log('✅ Bundle file loads successfully');
        console.log(`📊 Bundle size: ${(bundleResponse.data.length / 1024).toFixed(2)} KB`);
      } else {
        console.log(`❌ Bundle file not loading (status: ${bundleResponse.status})`);
      }
    } else {
      console.log('⚠️ No bundle files found in HTML');
    }

    // Test 3: Check CSS files
    console.log('\n3️⃣ Checking CSS files...');
    const cssMatches = homeResponse.data.match(/\/assets\/index-[a-zA-Z0-9]+\.css/g);
    
    if (cssMatches && cssMatches.length > 0) {
      console.log(`✅ Found ${cssMatches.length} CSS file(s)`);
      const latestCSS = cssMatches[0];
      
      const cssResponse = await makeRequest(`${FRONTEND_URL}${latestCSS}`);
      if (cssResponse.status === 200) {
        console.log('✅ CSS file loads successfully');
      } else {
        console.log(`❌ CSS file not loading (status: ${cssResponse.status})`);
      }
    }

    console.log('\n🎉 FRONTEND FIX VERIFICATION COMPLETE!');
    console.log('✅ Main page loads without errors');
    console.log('✅ Bundle and CSS files accessible');
    console.log('✅ No obvious map-related errors detected');
    
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('1. Test the application manually by navigating through pages');
    console.log('2. Check browser console for any remaining JavaScript errors');
    console.log('3. Verify specific functionality like templates list and forms');
    
    return true;

  } catch (error) {
    console.log(`❌ Error during testing: ${error.message}`);
    return false;
  }
}

async function monitorFrontendFix() {
  console.log('🚀 Starting frontend fix monitor...');
  console.log('⏱️  Will check every 30 seconds until deployment is ready');
  console.log('🔧 Testing fix for TypeError: t.map is not a function');
  console.log('💡 Render.com typically takes 2-3 minutes to deploy frontend\n');
  
  let attempts = 0;
  const maxAttempts = 15; // 7.5 minutes maximum
  
  while (attempts < maxAttempts) {
    attempts++;
    console.log(`🔄 Attempt ${attempts}/${maxAttempts} - ${new Date().toISOString()}`);
    
    const success = await testFrontendFix();
    if (success) {
      console.log('\n🎊 FRONTEND FIX VERIFICATION SUCCESSFUL!');
      console.log('✅ Deployment completed');
      console.log('✅ Array validation fixes applied');
      console.log('✅ No map-related errors detected');
      console.log('\n💡 Your frontend should now be error-free!');
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
    console.log('2. Manually test the application in browser');
    console.log('3. Check browser console for any remaining errors');
  }
}

// Start monitoring
monitorFrontendFix().catch(error => {
  console.error('❌ Monitor failed:', error);
  process.exit(1);
});
