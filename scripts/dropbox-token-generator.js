/**
 * Dropbox Token Generator
 * This script helps generate an access token for Dropbox API integration.
 * 
 * Instructions:
 * 1. Run this script: node dropbox-token-generator.js
 * 2. Follow the provided URL in your browser
 * 3. Allow access to your Dropbox account
 * 4. Copy the generated token and add it to your .env file
 */

const http = require('http');
const url = require('url');
const { URLSearchParams } = require('url');
const open = require('open').default;
const crypto = require('crypto');

// Dropbox App credentials - Replace with your actual app credentials
const APP_KEY = 'your_dropbox_app_key_here';
const APP_SECRET = 'your_dropbox_app_secret_here';
const REDIRECT_URI = 'http://localhost:3000/auth/callback';

// Generate a random CSRF token to protect against CSRF attacks
const csrfToken = crypto.randomBytes(16).toString('hex');

// Start a local server to handle the OAuth callback
const server = http.createServer(async (req, res) => {
  if (req.url.startsWith('/auth/callback')) {
    try {
      const parsedUrl = url.parse(req.url);
      const params = new URLSearchParams(parsedUrl.query);
      
      const code = params.get('code');
      const state = params.get('state');
      
      // Verify CSRF token
      if (state !== csrfToken) {
        throw new Error('Invalid state parameter. Possible CSRF attack.');
      }
      
      if (!code) {
        throw new Error('No authorization code received');
      }
      
      // Exchange the authorization code for an access token
      const tokenResponse = await exchangeCodeForToken(code);
      
      if (tokenResponse && tokenResponse.access_token) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1>Dropbox Token Generated Successfully!</h1>
              <p>Your access token has been generated. Please add it to your <code>.env</code> file:</p>
              <pre style="background-color: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto;">DROPBOX_ACCESS_TOKEN=${tokenResponse.access_token}</pre>
              <p><strong>Important:</strong> Keep this token secure and do not share it publicly.</p>
              <p>You can close this window now and return to your terminal.</p>
            </body>
          </html>
        `);
        console.log('\n✅ Token generated successfully!');
        console.log('\nAdd the following to your .env file:');
        console.log(`\nDROPBOX_ACCESS_TOKEN=${tokenResponse.access_token}\n`);
        
        // Close the server after a short delay
        setTimeout(() => {
          server.close();
          console.log('Token generator server closed. You can now continue with your project setup.');
          process.exit(0);
        }, 2000);
      } else {
        throw new Error('Failed to obtain access token');
      }
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1>Error Generating Token</h1>
            <p>An error occurred: ${error.message}</p>
            <p>Please close this window and try again.</p>
          </body>
        </html>
      `);
      console.error('❌ Error:', error.message);
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Function to exchange authorization code for access token
async function exchangeCodeForToken(code) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      client_id: APP_KEY,
      client_secret: APP_SECRET
    });

    const options = {
      hostname: 'api.dropbox.com',
      path: '/oauth2/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const req = require('https').request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const tokenData = JSON.parse(data);
          if (tokenData.error) {
            reject(new Error(`Dropbox API error: ${tokenData.error_description || tokenData.error}`));
          } else {
            resolve(tokenData);
          }
        } catch (error) {
          reject(new Error('Failed to parse token response'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(params.toString());
    req.end();
  });
}

// Start the local server on port 3000
server.listen(3000, () => {
  console.log('Starting Dropbox token generator...');
  console.log('Local server listening on http://localhost:3000');
  
  // Construct the authorization URL
  const authUrl = new URL('https://www.dropbox.com/oauth2/authorize');
  authUrl.searchParams.append('client_id', APP_KEY);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('state', csrfToken);
  
  console.log('\n🔐 Please authorize the app in your browser...\n');
  console.log(authUrl.toString());
  
  // Open the authorization URL in the default browser
  open(authUrl.toString()).catch(() => {
    console.log('Failed to open browser automatically. Please copy and paste the URL into your browser.');
  });
});

console.log(`
=====================================
Dropbox Token Generator
=====================================

This script will help you generate an access token for Dropbox API integration.
A browser window should open automatically. If it doesn't, please copy and paste the URL that will appear below.

After authorizing the application in your browser, the access token will be displayed here.
Add the token to your .env file to complete the Dropbox integration setup.
`);
