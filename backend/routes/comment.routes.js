import express from 'express';
import db from '../models/index.js';
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();
const { Comment, User, Template } = db;

// Debug route to test comments endpoint
router.get('/debug/test', (req, res) => {
  res.json({ 
    message: 'Comments routes are working',
    timestamp: new Date().toISOString(),
    availableRoutes: [
      'GET /api/comments/template/:templateId',
      'POST /api/comments',
      'DELETE /api/comments/:id'
    ]
  });
});

// Obtener comentarios de un template
router.get('/template/:templateId', authenticateToken, async (req, res) => {
  try {
    const templateId = req.params.templateId;
    console.log(`[COMMENTS] Getting comments for template ${templateId}`);
    
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
    
    console.log(`[COMMENTS] Found ${comments.length} comments for template ${templateId}`);
    res.json(comments);
  } catch (err) {
    console.error(`[COMMENTS] Error fetching comments:`, err);
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
    // Verifica que el template exista
    const template = await Template.findByPk(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found." });
    }
    // Crea el comentario
    const comment = await Comment.create({
      templateId,
      userId: req.user.id,
      content: content.trim()
    });
    // Incluye los datos del usuario en la respuesta
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: "User",
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });
    res.status(201).json(commentWithUser);
  } catch (err) {
    res.status(500).json({ message: "Error creating comment", error: err.message });
  }
});

// Editar un comentario
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required." });
    }
    const comment = await db.Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    // Solo el autor o admin puede editar
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden." });
    }
    comment.content = content.trim();
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: "Error updating comment", error: err.message });
  }
});

// Eliminar un comentario
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const comment = await db.Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    // Solo el autor o admin puede eliminar
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden." });
    }
    await comment.destroy();
    res.json({ message: "Comment deleted." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting comment", error: err.message });
  }
});

export default router;