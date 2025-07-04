import express from 'express';
import db from '../models/index.js';
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

export default router;