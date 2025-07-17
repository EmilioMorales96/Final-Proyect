#!/usr/bin/env node

/**
 * Plan de Contingencia Salesforce - Activación Inmediata
 * Se ejecuta cuando Client Credentials Flow no responde después de 60+ minutos
 */

const https = require('https');

const CONFIG = {
    TEST_URL: 'https://backend-service-pu47.onrender.com/api/salesforce/debug/test-auth',
    OAUTH_URL: 'https://backend-service-pu47.onrender.com/api/salesforce/debug/oauth-url',
    FRONTEND_URL: 'https://frontend-service-jq4c.onrender.com',
    TIMEOUT_MINUTES: 65
};

async function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => data += chunk);
            response.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(new Error(`Error parsing JSON: ${error.message}`));
                }
            });
        });
        
        request.on('error', reject);
        request.setTimeout(30000, () => {
            request.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

async function executeContingencyPlan() {
    console.log(`\n${'🚨'.repeat(20)}`);
    console.log(`    PLAN DE CONTINGENCIA ACTIVADO`);
    console.log(`${'🚨'.repeat(20)}`);
    
    console.log(`\n📋 Estado de timeout alcanzado:`);
    console.log(`   • Client Credentials Flow no respondió en ${CONFIG.TIMEOUT_MINUTES} minutos`);
    console.log(`   • Activando solución alternativa inmediata`);
    
    // Verificación final de Client Credentials
    console.log(`\n🔍 VERIFICACIÓN FINAL - Client Credentials`);
    try {
        const finalCheck = await makeRequest(CONFIG.TEST_URL);
        
        if (finalCheck.status === 'success') {
            console.log(`\n🎉 ¡SORPRESA! Client Credentials finalmente funcionó!`);
            console.log(`✅ No se necesita contingencia - todo listo para usar`);
            return;
        }
        
        console.log(`❌ Confirmado: Client Credentials aún falla`);
        console.log(`📝 Error: ${JSON.stringify(finalCheck.error, null, 2)}`);
        
    } catch (error) {
        console.log(`❌ Error en verificación final: ${error.message}`);
    }
    
    // Activar OAuth Web Flow
    console.log(`\n🌐 ACTIVANDO OAUTH WEB FLOW`);
    try {
        const oauthResponse = await makeRequest(CONFIG.OAUTH_URL);
        
        if (oauthResponse.oauth_url) {
            console.log(`\n✅ OAuth URL generada exitosamente:`);
            console.log(`🔗 ${oauthResponse.oauth_url}`);
            
            console.log(`\n📋 INSTRUCCIONES INMEDIATAS:`);
            console.log(`\n1. 🌐 ABRIR EN NAVEGADOR:`);
            console.log(`   ${oauthResponse.oauth_url}`);
            
            console.log(`\n2. ✅ AUTORIZAR en Salesforce`);
            console.log(`   • Usar tus credenciales de Salesforce`);
            console.log(`   • Aprobar todos los permisos`);
            
            console.log(`\n3. 🔄 REDIRECCIÓN AUTOMÁTICA`);
            console.log(`   • Serás redirigido automáticamente`);
            console.log(`   • El callback procesará el código`);
            
            console.log(`\n4. 🚀 PROBAR INMEDIATAMENTE:`);
            console.log(`   ${CONFIG.FRONTEND_URL}`);
            
            console.log(`\n💡 VENTAJAS del OAuth Web Flow:`);
            console.log(`   ✅ Funciona inmediatamente`);
            console.log(`   ✅ No depende de propagación`);
            console.log(`   ✅ Tokens de larga duración`);
            console.log(`   ✅ Refresh automático`);
            
        } else {
            console.log(`❌ Error generando OAuth URL`);
            console.log(`📝 Respuesta: ${JSON.stringify(oauthResponse, null, 2)}`);
        }
        
    } catch (error) {
        console.log(`❌ Error activando OAuth: ${error.message}`);
    }
    
    // Plan B - Debugging adicional
    console.log(`\n🔧 PLAN B - DEBUGGING AVANZADO`);
    console.log(`\nSi OAuth también falla, verificar:`);
    console.log(`   1. 🔍 Variables de entorno en Render`);
    console.log(`   2. 🛠️ Connected App configuration`);
    console.log(`   3. 🔑 Client ID y Secret válidos`);
    console.log(`   4. 🌐 Callback URL exacto`);
    console.log(`   5. 📱 Domain whitelist en Salesforce`);
    
    console.log(`\n📞 CONTACTO DE EMERGENCIA:`);
    console.log(`   • Salesforce Trailblazer Community`);
    console.log(`   • Salesforce Developer Support`);
    console.log(`   • Stack Overflow: salesforce-oauth`);
    
    console.log(`\n🎯 RESULTADO ESPERADO:`);
    console.log(`   Una vez autorizado OAuth, podrás crear cuentas inmediatamente`);
    console.log(`   sin esperar más propagación de Client Credentials`);
}

// Ejecutar plan de contingencia
executeContingencyPlan().catch(console.error);
