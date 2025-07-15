import express from 'express';
import db from '../models/index.js';
const { Question } = db;
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

// Debug route to test questions endpoint
router.get('/debug/test', (req, res) => {
  res.json({ 
    message: 'Questions routes are working',
    timestamp: new Date().toISOString(),
    availableRoutes: [
      'POST /api/questions',
      'GET /api/questions/template/:templateId',
      'PUT /api/questions/:id',
      'DELETE /api/questions/:id'
    ]
  });
});

// Crear pregunta (solo autenticado)
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('[QUESTIONS] Creating question - User:', req.user.id);
    console.log('[QUESTIONS] Request body:', JSON.stringify(req.body, null, 2));
    
    const { templateId, type, title, description, showInTable, order, questionText, isRequired } = req.body;
    
    // Validation
    if (!templateId) {
      console.log('[QUESTIONS] ERROR: templateId is missing');
      return res.status(400).json({ message: 'Template ID is required.' });
    }
    
    if (!title) {
      console.log('[QUESTIONS] ERROR: title is missing');
      return res.status(400).json({ message: 'Question title is required.' });
    }
    
    const questionData = {
      templateId,
      type: type || 'text',
      title,
      description: description || questionText || title, // Support different field names
      showInTable: showInTable !== undefined ? showInTable : false,
      order: order || 0,
      isRequired: isRequired !== undefined ? isRequired : false
    };
    
    console.log('[QUESTIONS] Creating question with data:', questionData);
    
    const question = await Question.create(questionData);
    console.log('[QUESTIONS] Question created successfully with ID:', question.id);
    
    res.status(201).json(question);
  } catch (err) {
    console.error('[QUESTIONS] Error creating question:', err);
    res.status(500).json({ message: 'Error al crear la pregunta.', error: err.message });
  }
});

// Obtener preguntas de un template
router.get('/template/:templateId', async (req, res) => {
  try {
    const templateId = req.params.templateId;
    console.log(`[QUESTIONS] Getting questions for template ${templateId}`);
    
    const questions = await Question.findAll({
      where: { templateId },
      order: [['order', 'ASC']]
    });
    
    console.log(`[QUESTIONS] Found ${questions.length} questions for template ${templateId}`);
    res.json(questions);
  } catch (err) {
    console.error('[QUESTIONS] Error fetching questions:', err);
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