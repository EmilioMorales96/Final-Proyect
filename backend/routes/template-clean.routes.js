import express from 'express';
import db from '../models/index.js';
import authenticateToken from '../middleware/auth.middleware.js';

const { Template, User, Tag } = db;
const router = express.Router();

// Get all templates
router.get('/', async (req, res) => {
  try {
    const templates = await Template.findAll({
      include: [
        { model: User, as: 'author', attributes: ['username'] },
        { model: Tag, attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Error fetching templates' });
  }
});

// Create template
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, questions, tags, topic, isPublic } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    const template = await Template.create({
      title,
      description,
      questions: questions || [],
      topic: topic || 'Other',
      isPublic: isPublic !== false, // Default to true
      authorId: req.user.id
    });
    
    res.status(201).json({
      message: 'Template created successfully',
      template
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ message: 'Error creating template' });
  }
});

// Get template by ID
router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['username'] },
        { model: Tag, attributes: ['name'] }
      ]
    });
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ message: 'Error fetching template' });
  }
});

export default router;
