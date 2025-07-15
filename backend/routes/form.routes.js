import express from 'express';
import db from '../models/index.js';
import authenticateToken from '../middleware/auth.middleware.js';
import { requireAdmin, requireResourceOwnershipOrAdmin, requireFormAccessOrAdmin } from '../middleware/authorization.middleware.js';

const { Form, User, Template } = db;
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

// Listar todas las respuestas del usuario autenticado (must come before /:id)
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

// Obtener todos los forms (solo admin) - must come before /:id
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const forms = await db.Form.findAll({
      include: [
        { model: db.User, as: 'author', attributes: ['id', 'username', 'email', 'avatar'] }
      ]
    });
    res.json(forms);
  } catch (err) {
    console.error('Error en /admin/all:', err);
    res.status(500).json({ message: 'Error fetching forms', error: err.message });
  }
});

// Listar todas las respuestas de una plantilla específica (must come before /:id)
router.get('/template/:templateId', authenticateToken, async (req, res) => {
  console.log(`[FORMS] GET /template/${req.params.templateId} - User:`, req.user?.id, req.user?.role);
  try {
    const { templateId } = req.params;
    
    // First, check if the user has access to this template's answers
    const template = await Template.findByPk(templateId);
    if (!template) {
      console.log(`[FORMS] Template ${templateId} not found`);
      return res.status(404).json({ message: 'Template not found' });
    }
    
    console.log(`[FORMS] Template found: ${template.title}, authorId: ${template.authorId}, user: ${req.user.id}`);
    
    // Only template owner or admin can view answers
    if (template.authorId !== req.user.id && req.user.role !== 'admin') {
      console.log(`[FORMS] Access denied - user ${req.user.id} cannot access template ${templateId}`);
      return res.status(403).json({ message: 'You do not have permission to view these answers.' });
    }
    
    console.log(`[FORMS] Fetching forms for template ${templateId}`);
    const forms = await Form.findAll({
      where: { templateId: Number(templateId) },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email'],
          required: false
        },
      ],
    });
    
    console.log(`[FORMS] Found ${forms.length} forms for template ${templateId}`);
    res.json(forms);
  } catch (err) {
    console.error('Error in /template/:templateId route:', err);
    res.status(500).json({ message: 'Error al obtener respuestas.', error: err.message });
  }
});

// Obtener formulario por id (protegido) - must come after specific routes
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const form = await Form.findByPk(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching form', error: err.message });
  }
});

// Actualizar formulario (form owner, template owner, or admin)
router.put('/:id', authenticateToken, requireFormAccessOrAdmin, async (req, res) => {
  try {
    const form = await Form.findByPk(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    // Validación de datos
    if ('answers' in req.body && typeof req.body.answers !== 'object') {
      return res.status(400).json({ message: 'Answers must be an object.' });
    }

    await form.update(req.body);

    // Formulario actualizado
    return res.status(200).json({ message: "Form updated successfully.", form });
  } catch (err) {
    res.status(500).json({ message: 'Error updating form', error: err.message });
  }
});

// Eliminar formulario (form owner, template owner, or admin)
router.delete('/:id', authenticateToken, requireFormAccessOrAdmin, async (req, res) => {
  try {
    const form = await Form.findByPk(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    await form.destroy();
    res.json({ message: 'Form deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting form', error: err.message });
  }
});

export default router;