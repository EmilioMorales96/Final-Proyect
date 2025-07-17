#!/usr/bin/env node

/**
 * Backend Health Check Script
 * Verifica que todos los componentes del backend estén funcionando correctamente
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏥 Backend Health Check');
console.log('='.repeat(50));

// Verificar estructura de directorios
const requiredDirs = [
  'config',
  'controllers', 
  'middleware',
  'models',
  'routes',
  'scripts',
  'utils'
];

console.log('\n📁 Verificando estructura de directorios...');
requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir}/`);
  } else {
    console.log(`❌ ${dir}/ - FALTA`);
  }
});

// Verificar archivos principales
const requiredFiles = [
  'package.json',
  'server.js',
  'app.js',
  '.env.example'
];

console.log('\n📄 Verificando archivos principales...');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTA`);
  }
});

// Verificar variables de entorno
console.log('\n🔧 Verificando configuración de entorno...');
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ Archivo .env encontrado');
  
  // Leer variables importantes
  const envContent = fs.readFileSync(envPath, 'utf8');
  const importantVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'DROPBOX_ACCESS_TOKEN',
    'SALESFORCE_CLIENT_ID'
  ];
  
  importantVars.forEach(varName => {
    if (envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=your_`)) {
      console.log(`✅ ${varName} configurado`);
    } else {
      console.log(`⚠️ ${varName} no configurado o usa placeholder`);
    }
  });
} else {
  console.log('⚠️ Archivo .env no encontrado (normal en desarrollo)');
}

// Verificar package.json
console.log('\n📦 Verificando package.json...');
try {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  console.log(`✅ Nombre: ${packageJson.name}`);
  console.log(`✅ Versión: ${packageJson.version}`);
  
  if (packageJson.scripts && packageJson.scripts.start) {
    console.log(`✅ Script start: ${packageJson.scripts.start}`);
  } else {
    console.log('❌ Script start no encontrado');
  }
  
} catch (error) {
  console.log('❌ Error leyendo package.json:', error.message);
}

console.log('\n🎯 Verificación completa!');
console.log('='.repeat(50));
console.log('💡 Para ejecutar el servidor: npm start');
console.log('🧪 Para ejecutar tests: node scripts/test-*.js');
console.log('📚 Documentación: README.md');
