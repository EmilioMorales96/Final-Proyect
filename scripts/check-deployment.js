#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking deployment configuration...\n');

// Check essential files
const requiredFiles = [
  'backend/package.json',
  'backend/server.js',
  'frontend/package.json',
  'frontend/index.html',
  '.env.example'
];

console.log('📁 Checking essential files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Check backend package.json
console.log('\n📦 Checking backend scripts:');
try {
  const backendPkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
  
  if (backendPkg.scripts && backendPkg.scripts.start) {
    console.log(`✅ Start script: ${backendPkg.scripts.start}`);
  } else {
    console.log('❌ Start script not found');
  }
  
  if (backendPkg.scripts && backendPkg.scripts.dev) {
    console.log(`✅ Dev script: ${backendPkg.scripts.dev}`);
  } else {
    console.log('❌ Dev script not found');
  }
} catch (error) {
  console.log('❌ Error reading backend/package.json');
}

// Check frontend package.json
console.log('\n🎨 Checking frontend scripts:');
try {
  const frontendPkg = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
  
  if (frontendPkg.scripts && frontendPkg.scripts.build) {
    console.log(`✅ Build script: ${frontendPkg.scripts.build}`);
  } else {
    console.log('❌ Build script not found');
  }
  
  if (frontendPkg.scripts && frontendPkg.scripts.preview) {
    console.log(`✅ Preview script: ${frontendPkg.scripts.preview}`);
  } else {
    console.log('⚠️ Preview script not found (optional)');
  }
} catch (error) {
  console.log('❌ Error reading frontend/package.json');
}

// Check integration routes
console.log('\n🔗 Checking integration routes:');
const integrationRoutes = [
  'backend/routes/salesforce.routes.js',
  'backend/routes/external.routes.js',
  'backend/routes/support.routes.js'
];

integrationRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    console.log(`✅ ${route}`);
  } else {
    console.log(`❌ ${route} - MISSING`);
  }
});

// Check frontend components
console.log('\n⚛️ Checking frontend components:');
const integrationComponents = [
  'frontend/src/components/SalesforceIntegration.jsx',
  'frontend/src/components/ApiTokenManager.jsx',
  'frontend/src/components/SupportTicket.jsx',
  'frontend/src/components/FloatingHelpButton.jsx'
];

integrationComponents.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`✅ ${component}`);
  } else {
    console.log(`❌ ${component} - MISSING`);
  }
});

// Check environment variables example
console.log('\n🔧 Checking .env.example:');
try {
  const envExample = fs.readFileSync('.env.example', 'utf8');
  
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'SALESFORCE_INSTANCE_URL',
    'ONEDRIVE_ACCESS_TOKEN'
  ];
  
  requiredVars.forEach(variable => {
    if (envExample.includes(variable)) {
      console.log(`✅ ${variable}`);
    } else {
      console.log(`❌ ${variable} - MISSING`);
    }
  });
} catch (error) {
  console.log('❌ Error reading .env.example');
}

// ==============================================
// CURRENT DEPLOYMENT STATUS CHECK - July 16, 2025
// ==============================================

console.log('🔍 CHECKING LATEST BACKEND FIXES...\n');

const BASE_URL = 'https://backend-service-pu47.onrender.com';

console.log('📋 Test these URLs manually:');
console.log('');

console.log('✅ Health Check:');
console.log(`   ${BASE_URL}/health`);
console.log('   Expected: 200 OK with "Database connection successful"');
console.log('');

console.log('🔍 Fixed Routes Tests:');
console.log(`   ${BASE_URL}/api/favorites/debug/test`);
console.log('   Expected: 200 OK (was 404 before fix)');
console.log('');

console.log(`   ${BASE_URL}/api/comments/debug/test`);
console.log('   Expected: 200 OK (was 404 before fix)');
console.log('');

console.log(`   ${BASE_URL}/api/tags`);
console.log('   Expected: 200 OK (POST now available)');
console.log('');

console.log('🔧 PowerShell Test Commands:');
console.log(`Invoke-WebRequest -Uri "${BASE_URL}/health"`);
console.log(`Invoke-WebRequest -Uri "${BASE_URL}/api/favorites/debug/test"`);
console.log(`Invoke-WebRequest -Uri "${BASE_URL}/api/comments/debug/test"`);
console.log(`Invoke-WebRequest -Uri "${BASE_URL}/api/tags"`);
console.log('');

console.log('📊 Latest Fixes Applied:');
console.log('- ✅ favoriteRoutes: Import + Mount added');
console.log('- ✅ commentRoutes: Import + Mount added'); 
console.log('- ✅ tags POST: New endpoint added');
console.log('- ✅ likes: Error handling improved');
console.log('');

console.log('💡 If 404 errors persist, auto-deploy is still in progress.');

console.log('\n🚀 Verification completed!');
console.log('\n📋 Next steps:');
console.log('1. Upload code to GitHub');
console.log('2. Connect repository to Render');
console.log('3. Configure environment variables in Render');
console.log('4. Test deployment');
console.log('\n📚 See DEPLOYMENT.md for detailed instructions');
