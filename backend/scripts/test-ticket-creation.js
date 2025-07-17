/**
 * Test Support Ticket Creation
 * Prueba directa de la funcionalidad de creación de tickets sin servidor
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

// Import our cloud storage utility
import { uploadToDropbox } from '../utils/cloudStorage.js';

console.log('🎫 Testing Ticket Creation and Dropbox Upload...');
console.log('='.repeat(60));

// Create a test ticket
const testTicket = {
  id: `TICKET-${Date.now()}`,
  reportedBy: "test@example.com",
  priority: "Medium",
  summary: "Test ticket from automated test",
  description: "This is a test ticket to verify the complete ticket creation and Dropbox upload flow.",
  type: "Technical Issue",
  timestamp: new Date().toISOString(),
  status: "Open",
  context: {
    userAgent: "Test Script",
    url: "http://localhost:3000/test",
    timestamp: new Date().toISOString()
  }
};

console.log('📋 Test Ticket Created:');
console.log(JSON.stringify(testTicket, null, 2));

const fileName = `support-ticket-${testTicket.id}.json`;
const fileContent = JSON.stringify(testTicket, null, 2);

console.log(`\n📄 File: ${fileName}`);
console.log(`📊 Size: ${Buffer.byteLength(fileContent)} bytes`);

// Test the upload
async function testTicketUpload() {
  try {
    console.log('\n🚀 Uploading ticket to Dropbox...');
    
    const result = await uploadToDropbox(fileName, fileContent);
    
    console.log('✅ Upload successful!');
    console.log('📁 File details:', {
      name: result.name,
      path: result.path_display,
      size: result.size,
      id: result.id
    });

    console.log('\n🎯 Ticket creation test completed successfully!');
    console.log('💡 Your Power Automate integration should now be able to detect this file.');
    
  } catch (error) {
    console.error('\n❌ Upload failed:', error.message);
    
    if (error.message.includes('401')) {
      console.log('🔍 Issue: Invalid or expired access token');
    } else if (error.message.includes('403')) {
      console.log('🔍 Issue: Insufficient permissions');
    } else {
      console.log('🔍 Issue: Unknown error - check your configuration');
    }
  }
}

// Run the test
testTicketUpload();
