/**
 * Dropbox Connection Test Script
 * Tests the actual connection to Dropbox using your credentials
 */

// Import required modules
import https from 'https';
import fs from 'fs';
import path from 'path';

// Your Dropbox credentials
const DROPBOX_ACCESS_TOKEN = 'sl.AF3HxFPLo9-E4DZ687w4k07kBU6G3F_Urv4MxjQ3fTS9yua76f1X4sbnBm8m1XxC';

console.log('🧪 Testing Dropbox Connection...');
console.log('='.repeat(50));

// Test 1: Create a test JSON file
const testTicket = {
  id: `TEST-${Date.now()}`,
  message: "This is a test file to verify Dropbox integration",
  timestamp: new Date().toISOString(),
  source: "Connection Test Script"
};

const testFileName = `test-connection-${Date.now()}.json`;
const testContent = JSON.stringify(testTicket, null, 2);

console.log(`📄 Creating test file: ${testFileName}`);
console.log(`📊 File size: ${Buffer.byteLength(testContent)} bytes`);

// Test 2: Upload to Dropbox
async function uploadToDropbox() {
  return new Promise((resolve, reject) => {
    const postData = testContent;
    
    const options = {
      hostname: 'content.dropboxapi.com',
      path: '/2/files/upload',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DROPBOX_ACCESS_TOKEN}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: `/FormsApp-Tickets/${testFileName}`,
          mode: 'add',
          autorename: true
        }),
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log('🚀 Uploading to Dropbox...');
    console.log(`📍 Path: /FormsApp-Tickets/${testFileName}`);

    const req = https.request(options, (res) => {
      let data = '';
      
      console.log(`📡 Status Code: ${res.statusCode}`);
      console.log(`📋 Headers:`, res.headers);

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            console.log('✅ Upload successful!');
            console.log('📁 File info:', {
              name: result.name,
              path: result.path_display,
              size: result.size,
              id: result.id
            });
            resolve(result);
          } catch (error) {
            console.log('✅ Upload successful (raw response):', data);
            resolve(data);
          }
        } else {
          console.log('❌ Upload failed!');
          console.log('📄 Response:', data);
          reject(new Error(`Upload failed: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Request error:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Test 3: List files in Dropbox
async function listDropboxFiles() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      path: '/FormsApp-Tickets',
      recursive: false
    });

    const options = {
      hostname: 'api.dropboxapi.com',
      path: '/2/files/list_folder',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DROPBOX_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    console.log('📋 Listing Dropbox files...');

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            console.log(`📁 Found ${result.entries.length} files:`);
            result.entries.forEach((file, index) => {
              console.log(`   ${index + 1}. ${file.name} (${file.size} bytes)`);
            });
            resolve(result);
          } catch (error) {
            console.log('📄 Raw response:', data);
            reject(error);
          }
        } else {
          console.log('❌ List failed:', data);
          reject(new Error(`List failed: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Request error:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Run the tests
async function runTests() {
  try {
    console.log('\n🔐 Token check:');
    console.log(`   Length: ${DROPBOX_ACCESS_TOKEN.length} characters`);
    console.log(`   Starts with: ${DROPBOX_ACCESS_TOKEN.substring(0, 10)}...`);

    console.log('\n📤 Test 1: Upload file to Dropbox');
    await uploadToDropbox();

    console.log('\n📋 Test 2: List files in Dropbox');
    await listDropboxFiles();

    console.log('\n✅ All tests completed successfully!');
    console.log('🎯 Your Dropbox integration is working correctly.');
    
  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
    
    // Common error diagnostics
    if (error.message.includes('401')) {
      console.log('🔍 Diagnosis: Invalid or expired access token');
      console.log('💡 Solution: Generate a new access token from Dropbox App Console');
    } else if (error.message.includes('403')) {
      console.log('🔍 Diagnosis: Permission denied');
      console.log('💡 Solution: Check app permissions in Dropbox');
    } else if (error.message.includes('path/not_found')) {
      console.log('🔍 Diagnosis: FormsApp-Tickets folder does not exist');
      console.log('💡 Solution: Folder will be created automatically on first upload');
    }
  }
}

runTests();
