// 🎯 CLEAN SALESFORCE OAUTH URL GENERATOR
// ======================================

import dotenv from 'dotenv';
dotenv.config();

console.log('🚀 GENERANDO URL OAUTH PARA SALESFORCE CLEAN SYSTEM\n');

async function generateOAuthURL() {
  try {
    console.log('🔗 Generando URL OAuth...');
    
    const response = await fetch('http://localhost:3000/api/salesforce/oauth-url-public');
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('✅ URL OAuth generada exitosamente!\n');
      console.log('🔗 COPIA Y PEGA ESTA URL EN TU NAVEGADOR:');
      console.log('=' .repeat(80));
      console.log(data.oauth_url);
      console.log('=' .repeat(80));
      
      console.log('\n📋 INSTRUCCIONES:');
      data.instructions.forEach((instruction, index) => {
        console.log(`${index + 1}. ${instruction}`);
      });
      
      console.log('\n⚠️  IMPORTANTE:');
      console.log(data.important_note);
      
      console.log('\n🎯 CONFIGURACIÓN:');
      console.log('Client ID:', data.configuration.client_id);
      console.log('Redirect URI:', data.configuration.redirect_uri);
      console.log('Login URL:', data.configuration.login_url);
      
      console.log('\n✨ ¡Sistema Salesforce Clean Ready!');
      
    } else {
      console.error('❌ Error generando URL OAuth:', data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

generateOAuthURL();
