import express from 'express';
import db from '../models/index.js';
import authenticateToken from '../middleware/auth.middleware.js';
const router = express.Router();

// Autocomplete tags by prefix
router.get('/', async (req, res) => {
  const { search } = req.query;
  try {
    const where = search
      ? { name: { [db.Sequelize.Op.iLike]: `${search}%` } }
      : {};
    const tags = await db.Tag.findAll({
      where,
      limit: 10,
      order: [['name', 'ASC']]
    });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tags', error: err.message });
  }
});

// Get tag cloud (tags with their usage count)
router.get('/cloud', async (req, res) => {
  try {
    const tags = await db.Tag.findAll({
      include: [{
        model: db.Template,
        as: "Templates", 
        attributes: [],
        through: { attributes: [] }
      }],
      attributes: [
        'id',
        'name',
        [db.sequelize.fn('COUNT', db.sequelize.col('Templates.id')), 'count']
      ],
      group: ['Tag.id'],
      order: [[db.sequelize.literal('count'), 'DESC']]
    });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tag cloud', error: err.message });
  }
});

// Create a new tag
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Tag name is required' });
    }
    
    // Check if tag already exists (case insensitive)
    const existingTag = await db.Tag.findOne({
      where: { name: { [db.Sequelize.Op.iLike]: name.trim() } }
    });
    
    if (existingTag) {
      return res.json(existingTag);
    }
    
    // Create new tag
    const tag = await db.Tag.create({ name: name.trim() });
    res.status(201).json(tag);
  } catch (err) {
    console.error('Error creating tag:', err);
    res.status(500).json({ message: 'Error creating tag', error: err.message });
  }
});

export default router;