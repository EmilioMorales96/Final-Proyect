import express from 'express';
import { testEmailService, sendFormSubmissionEmail } from '../utils/emailService.js';
import authenticateToken from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';

const router = express.Router();

// Test email service configuration (Admin only)
router.get('/test', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await testEmailService();
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Email service is working correctly',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Test failed: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

// Send test email (Admin only)
router.post('/test-send', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email address is required' 
      });
    }

    // Mock form data for testing
    const mockFormData = {
      id: 'TEST-123',
      answers: {
        'What is your name?': 'Test User',
        'How would you rate our service?': 'Excellent',
        'Any additional comments?': 'This is a test email notification.'
      },
      createdAt: new Date()
    };

    const mockTemplate = {
      title: 'Test Form - Email Service Verification',
      description: 'This is a test email to verify that the email notification system is working correctly.'
    };

    const result = await sendFormSubmissionEmail(email, mockFormData, mockTemplate);
    
    if (result.success) {
      res.json({
        success: true,
        message: `Test email sent successfully to ${email}`,
        messageId: result.messageId,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message,
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to send test email: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
