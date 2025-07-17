import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

/**
 * Endpoint para actualizar Client ID en tiempo real
 * POST /api/salesforce/update-client-id
 */
router.post('/update-client-id', async (req, res) => {
  try {
    const { client_id } = req.body;
    
    if (!client_id) {
      return res.status(400).json({
        error: 'client_id is required'
      });
    }
    
    // Validar formato del Client ID
    if (!client_id.startsWith('3MVG') || client_id.length < 80) {
      return res.status(400).json({
        error: 'Invalid client_id format. Should start with 3MVG and be around 85 characters'
      });
    }
    
    console.log('🔧 Actualizando Client ID:', client_id.substring(0, 20) + '...');
    
    // Leer el archivo .env actual
    const envPath = path.join(process.cwd(), '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Reemplazar o agregar SALESFORCE_CLIENT_ID
    const clientIdRegex = /^SALESFORCE_CLIENT_ID=.*$/m;
    if (clientIdRegex.test(envContent)) {
      envContent = envContent.replace(clientIdRegex, `SALESFORCE_CLIENT_ID=${client_id}`);
    } else {
      envContent += `\nSALESFORCE_CLIENT_ID=${client_id}`;
    }
    
    // Escribir el archivo actualizado
    fs.writeFileSync(envPath, envContent);
    
    // Actualizar la variable de entorno en el proceso actual
    process.env.SALESFORCE_CLIENT_ID = client_id;
    
    console.log('✅ Client ID actualizado exitosamente');
    
    // Generar nuevo OAuth URL
    const redirectUri = 'https://backend-service-pu47.onrender.com/api/salesforce/oauth/callback';
    const oauthUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=api%20refresh_token`;
    
    res.json({
      status: 'success',
      message: 'Client ID updated successfully',
      old_client_id: 'Updated',
      new_client_id: client_id.substring(0, 20) + '...',
      new_oauth_url: oauthUrl,
      instructions: [
        '1. The .env file has been updated',
        '2. Environment variable updated in current process',
        '3. Use the new_oauth_url above to test',
        '4. Restart server for production use'
      ]
    });
    
  } catch (error) {
    console.error('❌ Error updating client ID:', error);
    res.status(500).json({
      error: 'Failed to update client ID',
      message: error.message
    });
  }
});

/**
 * Endpoint para comparar Client IDs
 * POST /api/salesforce/compare-client-id
 */
router.post('/compare-client-id', (req, res) => {
  const { client_id_from_salesforce } = req.body;
  const currentClientId = process.env.SALESFORCE_CLIENT_ID;
  
  if (!client_id_from_salesforce) {
    return res.status(400).json({
      error: 'client_id_from_salesforce is required'
    });
  }
  
  const match = currentClientId === client_id_from_salesforce;
  
  res.json({
    comparison: {
      match: match,
      current_in_env: currentClientId?.substring(0, 20) + '...',
      from_salesforce: client_id_from_salesforce?.substring(0, 20) + '...',
      current_length: currentClientId?.length,
      salesforce_length: client_id_from_salesforce?.length
    },
    action_needed: match ? 'No action needed' : 'Update required',
    update_instructions: match ? null : [
      '1. Use POST /api/salesforce/update-client-id',
      '2. Provide the correct client_id from Salesforce',
      '3. Test with the new OAuth URL'
    ]
  });
});

export default router;
