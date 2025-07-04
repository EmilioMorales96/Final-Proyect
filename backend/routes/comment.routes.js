import express from 'express';
import db from '../models/index.js';
const { Comment, User } = db;
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

// Get comments for a template (with user info)
router.get('/template/:templateId', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { templateId: req.params.templateId },
      include: [{ model: User, attributes: ['id', 'username', 'avatar'] }],
      order: [['createdAt', 'ASC']]
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
});

// Add comment (authenticated only)
router.post('/', authenticateToken, async (req, res) => {
  const { templateId, content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Comment content cannot be empty.' });
  }
  try {
    const comment = await Comment.create({
      templateId,
      userId: req.user.id,
      content
    });
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'username', 'avatar'] });
    res.status(201).json({ ...comment.toJSON(), User: user });
  } catch (err) {
    res.status(500).json({ message: 'Error creating comment', error: err.message });
  }
});

// Update comment (owner only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to edit this comment.' });
    }
    if ('content' in req.body && (!req.body.content || !req.body.content.trim())) {
      return res.status(400).json({ message: 'Comment content cannot be empty.' });
    }
    await comment.update(req.body);
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Error updating comment', error: err.message });
  }
});

// Delete comment (owner or admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to delete this comment.' });
    }
    await comment.destroy();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment', error: err.message });
  }
});

export default router;