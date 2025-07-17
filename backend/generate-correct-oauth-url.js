import dotenv from 'dotenv';
dotenv.config();

const clientId = '3MVG9dAEux2v1sLvdOrUdraM5cuNowe2zhCqrlOC02H0rB.4KFSDOmAukpIiSLkO.PRW3WMyN71AgmlIGR_2j';
const redirectUri = 'https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback';
const oauthUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=api%20refresh_token`;

console.log('🎯 OAUTH URL CORRECTO CON TU CONSUMER KEY:');
console.log('='.repeat(80));
console.log(oauthUrl);
console.log('='.repeat(80));
console.log('✅ Este URL ahora debería funcionar perfectamente!');
