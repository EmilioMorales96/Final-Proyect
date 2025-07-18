// Script para generar URL OAuth con el nuevo callback alternativo
const generateOAuthURL = () => {
  const clientId = '3MVG9dAEux2v1sLvdOrUdraM5cuNowe2zhCqrlOC02H0rB.4KFSDOmAukpIiSLkO.PRW3WMyN71AgmlIGR_2j';
  const redirectUri = 'https://backend-service-pu47.onrender.com/api/salesforce/auth-callback'; // NUEVO CALLBACK
  const loginUrl = 'https://login.salesforce.com';
  
  const authUrl = new URL(`${loginUrl}/services/oauth2/authorize`);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'api refresh_token offline_access');
  authUrl.searchParams.set('state', `alternative_test_${Date.now()}`);
  authUrl.searchParams.set('prompt', 'consent');
  
  console.log('🔗 NEW OAUTH URL WITH ALTERNATIVE CALLBACK:');
  console.log('');
  console.log(authUrl.toString());
  console.log('');
  console.log('✅ This URL uses the new /auth-callback endpoint that avoids static file conflicts');
  console.log('🔧 Make sure your Salesforce Connected App has this callback URL:');
  console.log(redirectUri);
};

generateOAuthURL();
