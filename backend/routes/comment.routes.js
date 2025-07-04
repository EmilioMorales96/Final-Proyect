import express from 'express';
import db from '../models/index.js';
const { Comment, User } = db;
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

// Obtener comentarios de un template
router.get('/template/:templateId', authenticateToken, async (req, res) => {
  try {
    const templateId = req.params.templateId;
    const comments = await Comment.findAll({
      where: { templateId },
      include: [
        {
          model: User,
          as: "User", // Usa el alias si tu relación es db.Comment.belongsTo(db.User, { as: "User", ... })
          attributes: ['id', 'username', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
});

export default router;