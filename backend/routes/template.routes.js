import express from 'express';
import db from '../models/index.js';
const { Template } = db;
const { Form, sequelize } = db;
import { userHasAccess } from '../utils/access.js';
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

// Create template (authenticated only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, topic, imageUrl, tags, isPublic, accessUsers, questions } = req.body;

    console.log("REQ.USER:", req.user);
    console.log("BODY:", {
      title,
      description,
      topic,
      imageUrl,
      tags,
      isPublic,
      accessUsers,
      questions
    });

    // Questions validation
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'You must add at least one question.' });
    }
    if (questions.some(q => !q.label || !q.label.trim())) {
      return res.status(400).json({ message: "Each question must have text." });
    }

    // Convert tags array to comma-separated string
    const tagsString = Array.isArray(tags) ? tags.join(',') : '';

    const template = await Template.create({
      title,
      description,
      topic,
      imageUrl,
      tags: tagsString,
      isPublic,
      accessUsers,
      authorId: req.user.id,
      questions, 
    });
    res.status(201).json(template);
  } catch (err) {
    console.error("Error creating template:", err);
    res.status(500).json({ message: 'Error creating template.', error: err.message });
  }
});

// Get all public templates
router.get('/', authenticateToken, async (req, res) => {
  console.log(`[TEMPLATES] GET /api/templates - user:`, req.user);
  try {
    const templates = await Template.findAll();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching templates', error: err.message });
  }
});

// Get a template by ID (with access control)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    // Permitir acceso a cualquier usuario si el template es público
    if (template.isPublic) {
      // Convert tags string to array
      const tagsArray = template.tags
        ? template.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];
      return res.json({ ...template.toJSON(), tags: tagsArray });
    }

    // Si no es público, usa la lógica de acceso actual
    if (!userHasAccess(template, req.user.id, req.user.role)) {
      return res.status(403).json({ message: 'You do not have access to this template.' });
    }

    // Convert tags string to array
    const tagsArray = template.tags
      ? template.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];

    res.json({ ...template.toJSON(), tags: tagsArray });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching template.', error: err.message });
  }
});

// Full-text search using MATCH ... AGAINST
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Missing search parameter.' });

  try {
    const templates = await Template.findAll({
      where: sequelize.literal(
        `MATCH (title, description, tags) AGAINST (${sequelize.escape(q)} IN NATURAL LANGUAGE MODE)`
      )
    });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: 'Search error.', error: err.message });
  }
});

// Top 5 most popular templates (by number of filled forms)
router.get('/top', async (req, res) => {
  try {
    // Count the number of forms per templateId
    const forms = await Form.findAll({
      attributes: [
        'templateId',
        [Form.sequelize.fn('COUNT', Form.sequelize.col('id')), 'count']
      ],
      group: ['templateId'],
      order: [[Form.sequelize.literal('count'), 'DESC']],
      limit: 5
    });

    // Get the corresponding templates
    const templateIds = forms.map(f => f.templateId);
    const templates = await Template.findAll({
      where: { id: templateIds }
    });

    // Merge the data
    const result = templates.map(t => {
      const formCount = forms.find(f => f.templateId === t.id);
      return {
        ...t.toJSON(),
        filledCount: formCount ? parseInt(formCount.get('count')) : 0
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching top templates.', error: err.message });
  }
});

// Update template (owner only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    if (template.authorId !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to edit this template.' });
    }

    // Questions validation if sent in the body
    if ('questions' in req.body) {
      const { questions } = req.body;
      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ message: 'You must add at least one question.' });
      }
      if (questions.some(q => !q.label || !q.label.trim())) {
        return res.status(400).json({ message: "Each question must have text." });
      }
    }

    // Convert tags to string if sent as array
    let updateData = { ...req.body };
    if ('tags' in req.body && Array.isArray(req.body.tags)) {
      updateData.tags = req.body.tags.join(',');
    }

    await template.update(updateData);
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: 'Error updating template', error: err.message });
  }
});

// Delete template (owner only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    if (template.authorId !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to delete this template.' });
    }

    await template.destroy();
    res.json({ message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting template', error: err.message });
  }
});

// Middleware to check access
router.use('/:id', async (req, res, next) => {
  if (req.method === 'GET') return next(); // Only apply to non-GET methods
  try {
    const template = await Template.findByPk(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    const hasAccess = userHasAccess(template, req.user.id, req.user.role);
    if (!hasAccess) return res.status(403).json({ message: 'You do not have access to this template.' });
    next();
  } catch (err) {
    res.status(500).json({ message: 'Error checking access.', error: err.message });
  }
});

export default router;
