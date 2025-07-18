// SERVIDOR UNIFICADO - SALESFORCE OAUTH
// =====================================
// Un solo archivo, todo incluido, sin complicaciones

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 🏠 HOME
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Salesforce OAuth Backend - UNIFICADO',
    version: '3.0-unified',
    endpoints: ['/', '/test', '/oauth/url', '/oauth/callback'],
    timestamp: new Date().toISOString()
  });
});

// 🧪 TEST
app.get('/test', (req, res) => {
  res.json({
    status: 'success',
    ready: !!(process.env.SALESFORCE_CLIENT_ID && process.env.SALESFORCE_CLIENT_SECRET),
    config: {
      client_id: !!process.env.SALESFORCE_CLIENT_ID,
      client_secret: !!process.env.SALESFORCE_CLIENT_SECRET
    }
  });
});

// 🔗 GENERAR OAUTH URL
app.get('/oauth/url', (req, res) => {
  if (!process.env.SALESFORCE_CLIENT_ID) {
    return res.status(400).json({ error: 'CLIENT_ID no configurado' });
  }

  const redirectUri = 'https://backend-service-pu47.onrender.com/oauth/callback';
  const state = `unified_${Date.now()}`;
  
  const authUrl = new URL('https://login.salesforce.com/services/oauth2/authorize');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', process.env.SALESFORCE_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'api refresh_token offline_access');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('prompt', 'consent');

  res.json({
    status: 'success',
    oauth_url: authUrl.toString(),
    state
  });
});

// 🔄 OAUTH CALLBACK
app.get('/oauth/callback', async (req, res) => {
  const { code, error, error_description } = req.query;
  
  console.log('CALLBACK:', { code: !!code, error });

  // HTML template simple
  const html = (title, content) => `
    <html>
    <head><title>${title}</title>
    <style>
      body{font-family:Arial;margin:40px;background:#f5f5f5}
      .container{max-width:800px;margin:0 auto;background:white;padding:30px;border-radius:10px}
      .success{color:#28a745} .error{color:#dc3545} .warning{color:#ffc107}
      pre{background:#f8f9fa;padding:15px;border-radius:5px}
      .btn{display:inline-block;padding:10px 20px;background:#007bff;color:white;text-decoration:none;border-radius:5px;margin:10px 5px}
    </style>
    </head>
    <body><div class="container"><h1>🚀 OAuth Salesforce</h1>${content}</div></body>
    </html>
  `;

  if (error) {
    return res.send(html('Error OAuth', `
      <h2 class="error">❌ Error: ${error}</h2>
      <p>Descripción: ${error_description || 'N/A'}</p>
      <pre>${JSON.stringify(req.query, null, 2)}</pre>
      <a href="/oauth/url" class="btn">🔄 Reintentar</a>
    `));
  }

  if (!code) {
    return res.send(html('Sin Código', `
      <h2 class="warning">⚠️ Sin código de autorización</h2>
      <p>No se recibió código de Salesforce</p>
      <pre>${JSON.stringify(req.query, null, 2)}</pre>
      <a href="/oauth/url" class="btn">🔗 Generar OAuth</a>
    `));
  }

  // Intercambio de código por token
  try {
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      redirect_uri: 'https://backend-service-pu47.onrender.com/oauth/callback',
      code
    });

    const response = await fetch('https://login.salesforce.com/services/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams
    });

    const data = await response.json();
    
    if (response.ok && data.access_token) {
      return res.send(html('✅ Éxito', `
        <h2 class="success">🎉 ¡OAuth Exitoso!</h2>
        <p>✅ Access Token obtenido correctamente</p>
        <p>✅ Instance URL: ${data.instance_url}</p>
        <h3>🚀 Sistema Listo</h3>
        <ul>
          <li>OAuth completado</li>
          <li>Integración funcionando</li>
          <li>Backend unificado operativo</li>
        </ul>
        <pre>${JSON.stringify({ status: 'SUCCESS', instance_url: data.instance_url }, null, 2)}</pre>
        <a href="/test" class="btn">🧪 Test</a>
      `));
    } else {
      return res.send(html('Error Token', `
        <h2 class="error">❌ Error obteniendo token</h2>
        <pre>${JSON.stringify(data, null, 2)}</pre>
        <a href="/oauth/url" class="btn">🔄 Reintentar</a>
      `));
    }
  } catch (error) {
    return res.status(500).send(html('Error', `
      <h2 class="error">💥 Error interno: ${error.message}</h2>
      <a href="/oauth/url" class="btn">🔄 Reintentar</a>
    `));
  }
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'No encontrado', path: req.originalUrl });
});

// Iniciar
app.listen(PORT, () => {
  console.log(`
🚀 SALESFORCE OAUTH UNIFICADO
📡 Puerto: ${PORT}
🔗 Endpoints: /, /test, /oauth/url, /oauth/callback
✅ Un solo archivo, sin complicaciones
  `);
});
