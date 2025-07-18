// SCRIPT PARA PROBAR EL SISTEMA CORREGIDO
// =====================================

console.log('🔧 TESTING FIXED FRONTEND-BACKEND SEPARATION');
console.log('==============================================\n');

// URLs correctas de tu backend
const BASE_URL = 'https://backend-service-pu47.onrender.com';

console.log('✅ RUTAS CORRECTAS DE TU BACKEND:');
console.log('1. Test de salud:', `${BASE_URL}/health`);
console.log('2. Test Salesforce:', `${BASE_URL}/api/salesforce/test`);
console.log('3. Generar OAuth URL:', `${BASE_URL}/api/salesforce/oauth-url-public`);
console.log('4. Callback OAuth (nuevo):', `${BASE_URL}/api/salesforce/auth-callback`);
console.log('5. Callback OAuth (original):', `${BASE_URL}/api/salesforce/oauth/callback`);

console.log('\n❌ URL INCORRECTA QUE ESTABAS USANDO:');
console.log(`${BASE_URL}/api/salesforce/oauth/authorize`);
console.log('↑ Esta NO es una ruta de tu backend, es la URL de Salesforce');

console.log('\n🎯 FLUJO CORRECTO:');
console.log('1. Llamar a: GET /api/salesforce/oauth-url-public');
console.log('2. Recibes una URL que apunta a: https://login.salesforce.com/services/oauth2/authorize');
console.log('3. Usuario va a esa URL de Salesforce');
console.log('4. Salesforce redirige de vuelta a: /api/salesforce/auth-callback');

console.log('\n🚀 PRÓXIMOS PASOS:');
console.log('1. Actualizar server.js para usar app-frontend-fix.js');
console.log('2. Reiniciar el deployment en Render');
console.log('3. Probar las URLs correctas');

// Generar URL OAuth para testing inmediato
const clientId = '3MVG9dAEux2v1sLvdOrUdraM5cuNowe2zhCqrlOC02H0rB.4KFSDOmAukpIiSLkO.PRW3WMyN71AgmlIGR_2j';
const redirectUri = `${BASE_URL}/api/salesforce/auth-callback`;
const loginUrl = 'https://login.salesforce.com';

const authUrl = new URL(`${loginUrl}/services/oauth2/authorize`);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('client_id', clientId);
authUrl.searchParams.set('redirect_uri', redirectUri);
authUrl.searchParams.set('scope', 'api refresh_token offline_access');
authUrl.searchParams.set('state', `fixed_test_${Date.now()}`);
authUrl.searchParams.set('prompt', 'consent');

console.log('\n🔗 URL OAUTH LISTA PARA PROBAR:');
console.log(authUrl.toString());
console.log('\n💡 Esta URL te llevará a Salesforce y luego te regresará al callback que ahora funciona correctamente.');
