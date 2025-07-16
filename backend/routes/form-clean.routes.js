import express from 'express';
import db from '../models/index.js';
import authenticateToken from '../middleware/auth.middleware.js';

const { Form, User, Template } = db;
const router = express.Router();

// Submit form answers
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { templateId, answers } = req.body;
    
    if (!templateId || !answers) {
      return res.status(400).json({ message: 'Template ID and answers are required' });
    }
    
    // Verify template exists
    const template = await Template.findByPk(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    const form = await Form.create({
      templateId,
      userId: req.user.id,
      answers
    });
    
    res.status(201).json({
      message: 'Form submitted successfully',
      form
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: 'Error submitting form' });
  }
});

// Get user's submitted forms
router.get('/mine', authenticateToken, async (req, res) => {
  try {
    const forms = await Form.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Template, attributes: ['title'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(forms);
  } catch (error) {
    console.error('Error fetching user forms:', error);
    res.status(500).json({ message: 'Error fetching forms' });
  }
});

export default router;
