import express from 'express';
import db from '../models/index.js';
const { Question } = db;
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

// Crear pregunta (solo autenticado)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { templateId, type, title, description, showInTable, order } = req.body;
    const question = await Question.create({
      templateId, type, title, description, showInTable, order
    });
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear la pregunta.', error: err.message });
  }
});

// Obtener preguntas de un template
router.get('/template/:templateId', async (req, res) => {
  try {
    const questions = await Question.findAll({
      where: { templateId: req.params.templateId },
      order: [['order', 'ASC']]
    });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener preguntas.', error: err.message });
  }
});

// Actualizar pregunta
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    if (!question) return res.status(404).json({ message: 'Pregunta no encontrada.' });
    await question.update(req.body);
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar la pregunta.', error: err.message });
  }
});

// Eliminar pregunta
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    if (!question) return res.status(404).json({ message: 'Pregunta no encontrada.' });
    await question.destroy();
    res.json({ message: 'Pregunta eliminada.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar la pregunta.', error: err.message });
  }
});

export default router;