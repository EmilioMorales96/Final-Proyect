import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Get current directory for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Real OneDrive Upload Function
 * Uses Microsoft Graph API to upload files to OneDrive
 */
export async function uploadToOneDrive(fileContent, fileName, ticketData) {
  const accessToken = process.env.ONEDRIVE_ACCESS_TOKEN;
  
  if (!accessToken) {
    throw new Error('OneDrive access token not configured');
  }

  try {
    // Upload to OneDrive using Microsoft Graph API
    const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/FormsApp-Tickets/${fileName}:/content`;
    
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: fileContent
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ OneDrive upload successful:', fileName);
      
      return {
        success: true,
        platform: 'OneDrive',
        fileId: result.id,
        webUrl: result.webUrl,
        downloadUrl: result['@microsoft.graph.downloadUrl'],
        size: result.size,
        createdDateTime: result.createdDateTime
      };
    } else {
      const errorText = await response.text();
      console.error('❌ OneDrive upload failed:', response.status, errorText);
      throw new Error(`OneDrive upload failed: ${response.status} - ${errorText}`);
    }

  } catch (error) {
    console.error('OneDrive upload exception:', error);
    throw error;
  }
}

/**
 * Real Dropbox Upload Function
 * Uses Dropbox API v2 to upload files
 */
export async function uploadToDropbox(fileContent, fileName, ticketData) {
  const accessToken = process.env.DROPBOX_ACCESS_TOKEN;
  
  console.log('🔍 DEBUG - DROPBOX_ACCESS_TOKEN exists:', !!accessToken);
  console.log('🔍 DEBUG - Token length:', accessToken?.length || 'undefined');
  
  if (!accessToken) {
    throw new Error('Dropbox access token not configured');
  }

  try {
    // Upload to Dropbox using API v2
    const uploadUrl = 'https://content.dropboxapi.com/2/files/upload';
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: `/FormsApp-Tickets/${fileName}`,
          mode: 'add',
          autorename: true
        })
      },
      body: fileContent
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Dropbox upload successful:', fileName);
      
      return {
        success: true,
        platform: 'Dropbox',
        fileId: result.id,
        pathDisplay: result.path_display,
        size: result.size,
        serverModified: result.server_modified,
        clientModified: result.client_modified
      };
    } else {
      const errorText = await response.text();
      console.error('❌ Dropbox upload failed:', response.status, errorText);
      throw new Error(`Dropbox upload failed: ${response.status} - ${errorText}`);
    }

  } catch (error) {
    console.error('Dropbox upload exception:', error);
    throw error;
  }
}

/**
 * Test Cloud Storage Connection
 * Validates that the configured tokens work
 */
export async function testCloudStorageConnection() {
  const results = {
    onedrive: { available: false, tested: false, error: null },
    dropbox: { available: false, tested: false, error: null }
  };

  // Test OneDrive
  if (process.env.ONEDRIVE_ACCESS_TOKEN) {
    results.onedrive.available = true;
    try {
      const testContent = JSON.stringify({
        test: true,
        timestamp: new Date().toISOString(),
        message: 'This is a test file from FormsApp'
      }, null, 2);
      
      const testFileName = `test-connection-${Date.now()}.json`;
      await uploadToOneDrive(testContent, testFileName, {});
      
      results.onedrive.tested = true;
      results.onedrive.success = true;
    } catch (error) {
      results.onedrive.tested = true;
      results.onedrive.success = false;
      results.onedrive.error = error.message;
    }
  }

  // Test Dropbox
  if (process.env.DROPBOX_ACCESS_TOKEN) {
    results.dropbox.available = true;
    try {
      const testContent = JSON.stringify({
        test: true,
        timestamp: new Date().toISOString(),
        message: 'This is a test file from FormsApp'
      }, null, 2);
      
      const testFileName = `test-connection-${Date.now()}.json`;
      await uploadToDropbox(testContent, testFileName, {});
      
      results.dropbox.tested = true;
      results.dropbox.success = true;
    } catch (error) {
      results.dropbox.tested = true;
      results.dropbox.success = false;
      results.dropbox.error = error.message;
    }
  }

  return results;
}

/**
 * Clean up old test files (optional)
 */
export async function cleanupTestFiles() {
  // This would require additional API calls to list and delete files
  // Implementation depends on specific requirements
  console.log('Test file cleanup not implemented - manual cleanup may be required');
}
