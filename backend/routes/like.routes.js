import express from 'express';
import db from '../models/index.js';
const { Like, Template } = db;
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

// Get likes count and if current user liked
router.get('/template/:templateId', authenticateToken, async (req, res) => {
  try {
    const templateId = req.params.templateId;
    const count = await Like.count({ where: { templateId } });
    const liked = await Like.findOne({ where: { templateId, userId: req.user.id } });
    res.json({ count, liked: !!liked });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching likes', error: err.message });
  }
});

// Add like (authenticated only, one per user)
router.post('/', authenticateToken, async (req, res) => {
  const { templateId } = req.body;
  // Optionally: check if template exists
  try {
    const [like, created] = await Like.findOrCreate({
      where: { templateId, userId: req.user.id }
    });
    res.status(201).json({ liked: created });
  } catch (err) {
    res.status(500).json({ message: 'Error liking template', error: err.message });
  }
});

// Remove like
router.delete('/', authenticateToken, async (req, res) => {
  const { templateId } = req.body;
  try {
    await Like.destroy({ where: { templateId, userId: req.user.id } });
    res.json({ message: 'Like removed.' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing like', error: err.message });
  }
});

export default router;