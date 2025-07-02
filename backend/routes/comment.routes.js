import express from 'express';
import db from '../models/index.js';
const { Comment } = db;
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

// Get comments for a template
router.get('/template/:templateId', async (req, res) => {
  const comments = await Comment.findAll({
    where: { templateId: req.params.templateId },
    order: [['createdAt', 'ASC']]
  });
  res.json(comments);
});

// Add comment (authenticated only)
router.post('/', authenticateToken, async (req, res) => {
  const { templateId, content } = req.body;
  const comment = await Comment.create({
    templateId,
    userId: req.user.id,
    content
  });
  res.status(201).json(comment);
});

// Update comment (owner only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to edit this comment.' });
    }

    await comment.update(req.body);
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Error updating comment', error: err.message });
  }
});

// Delete comment (owner only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to delete this comment.' });
    }

    await comment.destroy();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment', error: err.message });
  }
});

export default router;