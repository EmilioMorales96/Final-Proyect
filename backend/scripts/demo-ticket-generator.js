import fs from 'fs';
import path from 'path';

/**
 * Demo Script - Creates a sample support ticket JSON file
 * This shows exactly what gets uploaded to Dropbox
 */

// Sample ticket data (exactly like what the real app creates)
const sampleTicket = {
  id: `TICKET-${Date.now()}-demo123`,
  reportedBy: "demo.user@example.com",
  userId: 123,
  template: "Customer Feedback Form",
  link: "https://your-app.onrender.com/forms/fill/15",
  priority: "High",
  summary: "Unable to submit form - getting validation errors when trying to save responses",
  admins: ["admin@formsapp.com", "support@formsapp.com"],
  createdAt: new Date().toISOString(),
  status: "Open",
  context: {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    page: "/forms/fill/15",
    referrer: "https://your-app.onrender.com/dashboard",
    timestamp: new Date().toISOString()
  }
};

// Create the JSON file (exactly like the real app does)
const fileName = `demo-support-ticket-${sampleTicket.id}.json`;
const ticketsDir = path.join(process.cwd(), 'uploads', 'tickets');

// Ensure directory exists
if (!fs.existsSync(ticketsDir)) {
  fs.mkdirSync(ticketsDir, { recursive: true });
}

const filePath = path.join(ticketsDir, fileName);

// Write the JSON file with proper formatting
fs.writeFileSync(filePath, JSON.stringify(sampleTicket, null, 2));

console.log('🎫 Demo Support Ticket Created!');
console.log('='.repeat(50));
console.log(`📁 File: ${fileName}`);
console.log(`📍 Location: ${filePath}`);
console.log(`📄 Size: ${fs.statSync(filePath).size} bytes`);
console.log('');
console.log('📋 Content Preview:');
console.log('='.repeat(50));
console.log(JSON.stringify(sampleTicket, null, 2));
console.log('');
console.log('✅ This is exactly what gets uploaded to Dropbox!');
console.log('🔗 Real tickets will have similar structure but with actual user data.');

// Show file info
const stats = fs.statSync(filePath);
console.log('');
console.log('📊 File Information:');
console.log(`   - Size: ${stats.size} bytes`);
console.log(`   - Created: ${stats.birthtime}`);
console.log(`   - Format: JSON`);
console.log(`   - Encoding: UTF-8`);
