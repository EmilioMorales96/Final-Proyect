#!/usr/bin/env node

/**
 * Monitor automático para Salesforce Client Credentials Flow
 * Verifica cada 5 minutos hasta que la autenticación funcione
 */

const https = require('https');

const CONFIG = {
    TEST_URL: 'https://backend-service-pu47.onrender.com/api/salesforce/debug/test-auth',
    CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutos en millisegundos
    MAX_ATTEMPTS: 20, // Máximo 20 intentos (100 minutos)
    START_TIME: new Date(),
    EXPECTED_COMPLETION: new Date(Date.now() + 60 * 60 * 1000) // 60 minutos desde ahora
};

let attemptCount = 0;

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, (response) => {
            let data = '';
            
            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (error) {
                    reject(new Error(`Error parsing JSON: ${error.message}`));
                }
            });
        });
        
        request.on('error', (error) => {
            reject(error);
        });
        
        request.setTimeout(30000, () => {
            request.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

function formatTime(date) {
    return date.toLocaleTimeString('es-ES', { 
        timeZone: 'UTC',
        hour12: false 
    }) + ' UTC';
}

function calculateProgress() {
    const elapsed = Date.now() - CONFIG.START_TIME.getTime();
    const elapsedMinutes = Math.floor(elapsed / (1000 * 60));
    const progressPercent = Math.min((elapsedMinutes / 60) * 100, 100);
    return { elapsedMinutes, progressPercent };
}

function showProgress() {
    const { elapsedMinutes, progressPercent } = calculateProgress();
    const progressBar = '█'.repeat(Math.floor(progressPercent / 5)) + '░'.repeat(20 - Math.floor(progressPercent / 5));
    
    console.log(`\n🔄 Progreso de propagación:`);
    console.log(`   [${progressBar}] ${progressPercent.toFixed(1)}%`);
    console.log(`   ⏱️  Tiempo transcurrido: ${elapsedMinutes} minutos`);
    console.log(`   🎯 Tiempo estimado total: 30-60 minutos`);
}

async function checkAuthentication() {
    attemptCount++;
    const currentTime = new Date();
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🔍 VERIFICACIÓN #${attemptCount} - ${formatTime(currentTime)}`);
    console.log(`${'='.repeat(60)}`);
    
    showProgress();
    
    try {
        console.log(`\n📡 Consultando: ${CONFIG.TEST_URL}`);
        const response = await makeRequest(CONFIG.TEST_URL);
        
        console.log(`\n📊 Respuesta recibida:`);
        console.log(JSON.stringify(response, null, 2));
        
        // Verificar si la autenticación fue exitosa
        if (response.status === 'success') {
            console.log(`\n🎉 ¡ÉXITO! La autenticación de Salesforce está funcionando!`);
            console.log(`\n✅ Resultados:`);
            console.log(`   • Estado: ${response.status}`);
            console.log(`   • Mensaje: ${response.message}`);
            console.log(`   • Instance URL: ${response.instance_url || 'No disponible'}`);
            console.log(`   • Token Type: ${response.token_type || 'No disponible'}`);
            
            const { elapsedMinutes } = calculateProgress();
            console.log(`\n📈 Estadísticas de propagación:`);
            console.log(`   • Tiempo total de espera: ${elapsedMinutes} minutos`);
            console.log(`   • Verificaciones realizadas: ${attemptCount}`);
            console.log(`   • Iniciado: ${formatTime(CONFIG.START_TIME)}`);
            console.log(`   • Completado: ${formatTime(currentTime)}`);
            
            console.log(`\n🚀 ¡Ya puedes probar la creación de cuentas de Salesforce!`);
            console.log(`\n🌐 Prueba tu aplicación en:`);
            console.log(`   https://frontend-service-jq4c.onrender.com`);
            
            process.exit(0);
        }
        
        // Si no fue exitoso, mostrar el error
        console.log(`\n❌ Estado actual: ${response.status || 'Error'}`);
        console.log(`📝 Detalle: ${response.error || response.message || 'Sin detalles'}`);
        
        if (response.error && response.error.includes('invalid_grant')) {
            console.log(`\n💡 Diagnóstico: Client Credentials Flow aún propagando...`);
        }
        
    } catch (error) {
        console.log(`\n❌ Error en la verificación:`);
        console.log(`   ${error.message}`);
    }
    
    // Verificar si hemos alcanzado el máximo de intentos
    if (attemptCount >= CONFIG.MAX_ATTEMPTS) {
        console.log(`\n⚠️  Se alcanzó el máximo de intentos (${CONFIG.MAX_ATTEMPTS})`);
        console.log(`\n🔧 Posibles acciones:`);
        console.log(`   1. Verificar configuración en Salesforce`);
        console.log(`   2. Revisar variables de entorno en Render`);
        console.log(`   3. Contactar soporte de Salesforce`);
        console.log(`\n🌐 Debug manual: ${CONFIG.TEST_URL}`);
        process.exit(1);
    }
    
    // Programar próxima verificación
    const nextCheck = new Date(Date.now() + CONFIG.CHECK_INTERVAL);
    console.log(`\n⏰ Próxima verificación: ${formatTime(nextCheck)}`);
    console.log(`⏳ Esperando ${CONFIG.CHECK_INTERVAL / 60000} minutos...`);
    
    setTimeout(checkAuthentication, CONFIG.CHECK_INTERVAL);
}

// Mostrar información inicial
console.log(`\n${'🚀'.repeat(20)}`);
console.log(`    MONITOR AUTOMÁTICO SALESFORCE AUTH`);
console.log(`${'🚀'.repeat(20)}`);

console.log(`\n📋 Configuración:`);
console.log(`   • URL de prueba: ${CONFIG.TEST_URL}`);
console.log(`   • Intervalo: ${CONFIG.CHECK_INTERVAL / 60000} minutos`);
console.log(`   • Máximo intentos: ${CONFIG.MAX_ATTEMPTS}`);
console.log(`   • Tiempo estimado: 30-60 minutos`);
console.log(`   • Iniciado: ${formatTime(CONFIG.START_TIME)}`);
console.log(`   • Completado estimado: ${formatTime(CONFIG.EXPECTED_COMPLETION)}`);

console.log(`\n💡 El script se ejecutará automáticamente hasta que:`);
console.log(`   ✅ La autenticación sea exitosa`);
console.log(`   ⏰ Se alcance el máximo de intentos`);
console.log(`   🛑 Presiones Ctrl+C para detener`);

console.log(`\n🔄 Iniciando monitoreo...`);

// Iniciar primera verificación
checkAuthentication();

// Manejar señal de interrupción
process.on('SIGINT', () => {
    const { elapsedMinutes } = calculateProgress();
    console.log(`\n\n🛑 Monitor detenido por el usuario`);
    console.log(`📊 Estadísticas finales:`);
    console.log(`   • Verificaciones realizadas: ${attemptCount}`);
    console.log(`   • Tiempo transcurrido: ${elapsedMinutes} minutos`);
    console.log(`   • Iniciado: ${formatTime(CONFIG.START_TIME)}`);
    console.log(`   • Detenido: ${formatTime(new Date())}`);
    console.log(`\n🔧 Para verificar manualmente: ${CONFIG.TEST_URL}`);
    process.exit(0);
});
