import express from 'express';
import db from '../models/index.js';
const { Like } = db;
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

// Get likes for a template
router.get('/template/:templateId', async (req, res) => {
  const likes = await Like.count({ where: { templateId: req.params.templateId } });
  res.json({ count: likes });
});

// Add like (authenticated only, one per user)
router.post('/', authenticateToken, async (req, res) => {
  const { templateId } = req.body;
  // Prevent duplicates
  const [like, created] = await Like.findOrCreate({
    where: { templateId, userId: req.user.id }
  });
  res.status(201).json({ liked: created });
});

// Remove like
router.delete('/', authenticateToken, async (req, res) => {
  const { templateId } = req.body;
  await Like.destroy({ where: { templateId, userId: req.user.id } });
  res.json({ message: 'Like removed.' });
});

export default router;