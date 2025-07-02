import express from 'express';
import db from '../models/index.js';
import authenticateToken from '../middleware/auth.middleware.js';

const { Form, User } = db;
const router = express.Router();

// Guardar respuestas de un formulario (protegido)
router.post('/', authenticateToken, async (req, res) => {
  const { templateId, answers } = req.body;

  if (!templateId || typeof templateId !== 'number') {
    return res.status(400).json({ message: 'El templateId es obligatorio y debe ser un número.' });
  }
  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ message: 'Las respuestas son obligatorias.' });
  }

  try {
    const form = await Form.create({
      templateId,
      userId: req.user.id,
      answers,
    });
    res.status(201).json(form);
  } catch (err) {
    res.status(500).json({ message: 'Error al guardar respuestas.', error: err.message });
  }
});

// Obtener todos los formularios (protegido)
router.get('/', authenticateToken, async (req, res) => {
  console.log(`[FORMS] GET /api/forms - user:`, req.user);
  try {
    const forms = await Form.findAll();
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching forms', error: err.message });
  }
});

// Obtener formulario por id (protegido)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const form = await Form.findByPk(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching form', error: err.message });
  }
});

// Actualizar formulario (solo dueño)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    const form = await Form.findByPk(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    // Solo el dueño puede editar
    if (form.userId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para editar este formulario.' });
    }

    await form.update({ title, description });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: 'Error updating form', error: err.message });
  }
});

// Eliminar formulario (solo dueño)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const form = await Form.findByPk(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    // Solo el dueño puede eliminar
    if (form.userId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este formulario.' });
    }

    await form.destroy();
    res.json({ message: 'Form deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting form', error: err.message });
  }
});

// Listar todas las respuestas del usuario autenticado
router.get('/mine', authenticateToken, async (req, res) => {
  try {
    const forms = await Form.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener respuestas.', error: err.message });
  }
});

// Listar todas las respuestas de una plantilla específica (con usuario)
router.get('/template/:templateId', authenticateToken, async (req, res) => {
  try {
    const { templateId } = req.params;
    const forms = await Form.findAll({
      where: { templateId: Number(templateId) },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'], // ajusta según tus campos
        },
      ],
    });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener respuestas.', error: err.message });
  }
});

export default router;