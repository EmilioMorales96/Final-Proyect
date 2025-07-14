import express from 'express';
import authenticateToken from '../middleware/auth.middleware.js';
import fs from 'fs';
import path from 'path';

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

    // Try OneDrive first
    if (process.env.ONEDRIVE_ACCESS_TOKEN) {
      const oneDriveResult = await uploadToOneDrive(fileContent, fileName, ticketData);
      if (oneDriveResult) return oneDriveResult;
    }

    // Try Dropbox as fallback
    if (process.env.DROPBOX_ACCESS_TOKEN) {
      const dropboxResult = await uploadToDropbox(fileContent, fileName, ticketData);
      if (dropboxResult) return dropboxResult;
    }

    return { success: false, message: 'No cloud storage configured' };

  } catch (error) {
    console.error('Cloud storage upload error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Upload to OneDrive
 */
async function uploadToOneDrive(fileContent, fileName, ticketData) {
  try {
    const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/FormsApp-Tickets/${fileName}:/content`;
    
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.ONEDRIVE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: fileContent
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        platform: 'OneDrive',
        fileId: result.id,
        webUrl: result.webUrl
      };
    } else {
      const error = await response.text();
      console.error('OneDrive upload error:', error);
      return null;
    }

  } catch (error) {
    console.error('OneDrive upload exception:', error);
    return null;
  }
}

/**
 * Upload to Dropbox
 */
async function uploadToDropbox(fileContent, fileName, ticketData) {
  try {
    const uploadUrl = 'https://content.dropboxapi.com/2/files/upload';
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
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
      return {
        success: true,
        platform: 'Dropbox',
        fileId: result.id,
        pathDisplay: result.path_display
      };
    } else {
      const error = await response.text();
      console.error('Dropbox upload error:', error);
      return null;
    }

  } catch (error) {
    console.error('Dropbox upload exception:', error);
    return null;
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

export default router;
