import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 VERIFICACIÓN COMPLETA DE SALESFORCE CONFIG');
console.log('='.repeat(50));

console.log('📋 Variables de entorno:');
console.log('CLIENT_ID:', process.env.SALESFORCE_CLIENT_ID);
console.log('CLIENT_SECRET:', process.env.SALESFORCE_CLIENT_SECRET);
console.log('IS_SANDBOX:', process.env.SALESFORCE_IS_SANDBOX);

console.log('\n🌐 URLs de autenticación:');
const isSandbox = process.env.SALESFORCE_IS_SANDBOX === 'true';
const baseUrl = isSandbox ? 'https://test.salesforce.com' : 'https://login.salesforce.com';
console.log('Base URL:', baseUrl);

const clientId = process.env.SALESFORCE_CLIENT_ID;
const redirectUri = 'https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback';

console.log('\n🔗 OAuth URL construido:');
const oauthUrl = `${baseUrl}/services/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=api%20refresh_token`;
console.log(oauthUrl);

console.log('\n⚠️  VERIFICACIONES:');
console.log('1. Client ID tiene longitud:', clientId?.length);
console.log('2. Client ID empieza con 3MVG:', clientId?.startsWith('3MVG'));
console.log('3. Es Sandbox:', isSandbox);
console.log('4. Callback URL correcto:', redirectUri);

console.log('\n📝 INSTRUCCIONES:');
console.log('1. Verifica que el Client ID en Salesforce coincida exactamente');
console.log('2. Verifica que la Connected App esté activa (✓ confirmado)');
console.log('3. Callback URL en Salesforce debe ser exactamente:', redirectUri);
console.log('4. Si es Sandbox, asegúrate de estar en test.salesforce.com');
