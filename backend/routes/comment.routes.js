import express from 'express';
import db from '../models/index.js';
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();
const { Comment, User } = db;

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

// Crear un comentario
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { templateId, content } = req.body;
    if (!templateId || !content || !content.trim()) {
      return res.status(400).json({ message: "Template and content are required." });
    }
    const comment = await Comment.create({
      templateId,
      userId: req.user.id,
      content: content.trim()
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Error creating comment", error: err.message });
  }
});

export default router;