import express from 'express';
import authenticateToken from '../middleware/auth.middleware.js';
import fs from 'fs';
import path from 'path';
import { uploadToOneDrive, uploadToDropbox, testCloudStorageConnection } from '../utils/cloudStorage.js';

const router = express.Router();

/**
 * Support Ticket Routes for Power Automate Integration
 * Creates JSON tickets and uploads them to cloud storage
 */

/**
 * Create support ticket and upload to cloud storage
 * POST /api/support/create-ticket
 */
router.post('/create-ticket', authenticateToken, async (req, res) => {
  try {
    const { reportedBy, template, link, priority, summary, admins } = req.body;
    const user = req.user;

    // Validate required fields
    if (!summary || !priority) {
      return res.status(400).json({ message: 'Summary and priority are required' });
    }

    // Create ticket object
    const ticket = {
      id: `TICKET-${Date.now()}-${user.id}`,
      reportedBy: reportedBy || user.email || user.username,
      userId: user.id,
      template: template || 'N/A',
      link: link || 'N/A',
      priority: priority,
      summary: summary,
      admins: admins || ['admin@formsapp.com'],
      createdAt: new Date().toISOString(),
      status: 'Open'
    };

    // Create JSON file
    const fileName = `support-ticket-${ticket.id}.json`;
    const filePath = path.join(process.cwd(), 'uploads', 'tickets', fileName);
    
    // Ensure tickets directory exists
    const ticketsDir = path.dirname(filePath);
    if (!fs.existsSync(ticketsDir)) {
      fs.mkdirSync(ticketsDir, { recursive: true });
    }

    // Write ticket to JSON file
    fs.writeFileSync(filePath, JSON.stringify(ticket, null, 2));

    // If OneDrive/Dropbox integration is configured, upload the file
    let uploadResult = null;
    
    if (process.env.ONEDRIVE_ACCESS_TOKEN || process.env.DROPBOX_ACCESS_TOKEN) {
      uploadResult = await uploadToCloudStorage(filePath, fileName, ticket);
    }

    res.json({
      message: 'Support ticket created successfully',
      ticketId: ticket.id,
      filePath: fileName,
      uploadResult: uploadResult
    });

  } catch (error) {
    console.error('Support ticket creation error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

/**
 * Upload file to OneDrive or Dropbox
 */
async function uploadToCloudStorage(filePath, fileName, ticketData) {
  try {
    const fileContent = fs.readFileSync(filePath);
    let uploadResult = null;

    // Try OneDrive first
    if (process.env.ONEDRIVE_ACCESS_TOKEN) {
      try {
        uploadResult = await uploadToOneDrive(fileContent, fileName, ticketData);
        if (uploadResult && uploadResult.success) {
          return uploadResult;
        }
      } catch (oneDriveError) {
        console.error('OneDrive upload failed:', oneDriveError.message);
      }
    }

    // Try Dropbox as fallback
    if (process.env.DROPBOX_ACCESS_TOKEN) {
      try {
        uploadResult = await uploadToDropbox(fileContent, fileName, ticketData);
        if (uploadResult && uploadResult.success) {
          return uploadResult;
        }
      } catch (dropboxError) {
        console.error('Dropbox upload failed:', dropboxError.message);
      }
    }

    // If no tokens configured, return simulated success for development
    if (!process.env.ONEDRIVE_ACCESS_TOKEN && !process.env.DROPBOX_ACCESS_TOKEN) {
      console.log('⚠️ No cloud storage tokens configured - using simulated upload');
      return {
        success: true,
        platform: 'Simulated',
        message: 'File saved locally (cloud storage not configured)',
        localPath: filePath
      };
    }

    return { success: false, message: 'All cloud storage uploads failed' };

  } catch (error) {
    console.error('Cloud storage upload error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user's support tickets (for admin/debugging)
 * GET /api/support/tickets
 */
router.get('/tickets', authenticateToken, async (req, res) => {
  try {
    const ticketsDir = path.join(process.cwd(), 'uploads', 'tickets');
    
    if (!fs.existsSync(ticketsDir)) {
      return res.json({ tickets: [] });
    }

    const files = fs.readdirSync(ticketsDir);
    const userTickets = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(ticketsDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const ticket = JSON.parse(content);
          
          // Only return tickets created by this user (unless admin)
          if (ticket.userId === req.user.id || req.user.role === 'admin') {
            userTickets.push(ticket);
          }
        } catch (error) {
          console.error('Error reading ticket file:', file, error);
        }
      }
    }

    // Sort by creation date (newest first)
    userTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ tickets: userTickets });

  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

/**
 * Test cloud storage connection
 * GET /api/support/test-connection
 */
router.get('/test-connection', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const results = await testCloudStorageConnection();
    
    res.json({
      status: 'completed',
      message: 'Cloud storage connection test completed',
      results: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Connection test error:', error);
    res.status(500).json({ 
      message: 'Connection test failed', 
      error: error.message 
    });
  }
});

export default router;
