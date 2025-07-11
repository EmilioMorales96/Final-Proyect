import express from 'express';
import db from '../models/index.js';
const { Template, Tag } = db;
import { userHasAccess } from '../utils/access.js';
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

// Create template (authenticated only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, topic, imageUrl, tags, isPublic, accessUsers, questions } = req.body;

    // Questions validation
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'You must add at least one question.' });
    }
    if (questions.some(q => !q.label || !q.label.trim())) {
      return res.status(400).json({ message: "Each question must have text." });
    }

    const template = await Template.create({
      title,
      description,
      topic,
      imageUrl,
      isPublic,
      allowedUsers: Array.isArray(accessUsers) ? accessUsers : [],
      authorId: req.user.id,
      questions,
    });

    // Associate tags (create if not exist)
    if (Array.isArray(tags)) {
      const tagInstances = await Promise.all(
        tags.map(name =>
          Tag.findOrCreate({ where: { name: name.trim().toLowerCase() } }).then(([tag]) => tag)
        )
      );
      await template.setTags(tagInstances);
    }

    res.status(201).json(template);
  } catch (err) {
    console.error("Error creating template:", err);
    res.status(500).json({ message: 'Error creating template.', error: err.message });
  }
});

// Get all accessible templates
router.get('/', authenticateToken, async (req, res) => {
  console.log("User in /api/templates:", req.user);
  try {
    const templates = await db.Template.findAll({
      include: [
        {
          model: db.User,
          as: "FavoredBy",
          attributes: ["id"],
          through: { attributes: [] }
        },
        {
          model: db.Tag,
          as: "Tags", 
          through: { attributes: [] }
        },
        {
          model: db.User,
          as: "author", 
          attributes: ["id", "username", "avatar"]
        }
      ],
      order: [["updatedAt", "DESC"]]
    });

    // Filter templates based on user access
    // Show all public templates + private templates the user has access to
    const accessibleTemplates = templates.filter(template => {
      return template.isPublic || userHasAccess(template, req.user.id, req.user.role);
    });

    res.json(accessibleTemplates);
  } catch (err) {
    console.error("Error fetching templates:", err);
    res.status(500).json({ message: 'Error fetching templates', error: err.message });
  }
});

// Get a template by ID (with access control)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    console.log(`[TEMPLATE] GET /:id - User ${req.user.id} requesting template ${req.params.id}`);
    const template = await Template.findByPk(req.params.id, {
      include: [
        {
          model: Tag,
          as: "Tags",
          through: { attributes: [] }
        },
        {
          model: db.User,
          as: "FavoredBy",
          attributes: ["id"],
          through: { attributes: [] }
        },
        {
          model: db.User,
          as: "author",
          attributes: ["id", "username", "avatar"]
        }
      ]
    });
    
    if (!template) {
      console.log(`[TEMPLATE] Template ${req.params.id} not found`);
      return res.status(404).json({ message: 'Template not found' });
    }

    console.log(`[TEMPLATE] Template found: ${template.title}, isPublic: ${template.isPublic}, authorId: ${template.authorId}`);
    
    if (template.isPublic || userHasAccess(template, req.user.id, req.user.role)) {
      console.log(`[TEMPLATE] Access granted to template ${req.params.id}`);
      return res.json(template);
    }
    
    console.log(`[TEMPLATE] Access denied to template ${req.params.id}`);
    return res.status(403).json({ message: 'You do not have access to this template.' });
  } catch (err) {
    console.error(`[TEMPLATE] Error fetching template ${req.params.id}:`, err);
    res.status(500).json({ message: 'Error fetching template.', error: err.message });
  }
});

// Update template (owner only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    const hasAccess = userHasAccess(template, req.user.id, req.user.role);
    if (!hasAccess) {
      return res.status(403).json({ message: 'You do not have permission to edit this template.' });
    }

    const { tags, ...updateData } = req.body;
    await template.update(updateData);

    // Update tags association
    if (Array.isArray(tags)) {
      const tagInstances = await Promise.all(
        tags.map(name =>
          Tag.findOrCreate({ where: { name: name.trim().toLowerCase() } }).then(([tag]) => tag)
        )
      );
      await template.setTags(tagInstances);
    }

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

export default router;
