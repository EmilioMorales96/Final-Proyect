#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración para deployment...\n');

// Verificar archivos esenciales
const requiredFiles = [
  'backend/package.json',
  'backend/server.js',
  'frontend/package.json',
  'frontend/index.html',
  '.env.example'
];

console.log('📁 Verificando archivos esenciales:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANTE`);
  }
});

// Verificar package.json del backend
console.log('\n📦 Verificando scripts del backend:');
try {
  const backendPkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
  
  if (backendPkg.scripts && backendPkg.scripts.start) {
    console.log(`✅ Script start: ${backendPkg.scripts.start}`);
  } else {
    console.log('❌ Script start no encontrado');
  }
  
  if (backendPkg.scripts && backendPkg.scripts.dev) {
    console.log(`✅ Script dev: ${backendPkg.scripts.dev}`);
  } else {
    console.log('❌ Script dev no encontrado');
  }
} catch (error) {
  console.log('❌ Error leyendo backend/package.json');
}

// Verificar package.json del frontend
console.log('\n🎨 Verificando scripts del frontend:');
try {
  const frontendPkg = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
  
  if (frontendPkg.scripts && frontendPkg.scripts.build) {
    console.log(`✅ Script build: ${frontendPkg.scripts.build}`);
  } else {
    console.log('❌ Script build no encontrado');
  }
  
  if (frontendPkg.scripts && frontendPkg.scripts.preview) {
    console.log(`✅ Script preview: ${frontendPkg.scripts.preview}`);
  } else {
    console.log('⚠️ Script preview no encontrado (opcional)');
  }
} catch (error) {
  console.log('❌ Error leyendo frontend/package.json');
}

// Verificar rutas de integración
console.log('\n🔗 Verificando rutas de integración:');
const integrationRoutes = [
  'backend/routes/salesforce.routes.js',
  'backend/routes/external.routes.js',
  'backend/routes/support.routes.js'
];

integrationRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    console.log(`✅ ${route}`);
  } else {
    console.log(`❌ ${route} - FALTANTE`);
  }
});

// Verificar componentes de integración
console.log('\n⚛️ Verificando componentes del frontend:');
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
    console.log(`❌ ${component} - FALTANTE`);
  }
});

// Verificar variables de entorno de ejemplo
console.log('\n🔧 Verificando .env.example:');
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
      console.log(`❌ ${variable} - FALTANTE`);
    }
  });
} catch (error) {
  console.log('❌ Error leyendo .env.example');
}

console.log('\n🚀 Verificación completada!');
console.log('\n📋 Pasos siguientes:');
console.log('1. Subir código a GitHub');
console.log('2. Conectar repositorio a Render');
console.log('3. Configurar variables de entorno en Render');
console.log('4. Probar deployment');
console.log('\n📚 Ver DEPLOYMENT.md para instrucciones detalladas');
