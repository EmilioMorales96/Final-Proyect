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
  console.log(`[LIKES] User ${req.user.id} trying to like template ${templateId}`);
  
  try {
    // Validate templateId
    if (!templateId) {
      console.log(`[LIKES] No templateId provided`);
      return res.status(400).json({ message: 'Template ID is required' });
    }

    // Convert templateId to integer for consistency
    const templateIdInt = parseInt(templateId);
    if (isNaN(templateIdInt)) {
      console.log(`[LIKES] Invalid templateId: ${templateId}`);
      return res.status(400).json({ message: 'Invalid template ID format' });
    }

    // Check if template exists and is accessible
    const template = await Template.findByPk(templateIdInt);
    if (!template) {
      console.log(`[LIKES] Template ${templateIdInt} not found`);
      return res.status(404).json({ message: 'Template not found' });
    }
    
    // For likes, we allow liking any public template or templates the user has access to
    if (!template.isPublic && template.authorId !== req.user.id && req.user.role !== 'admin') {
      console.log(`[LIKES] User ${req.user.id} cannot like private template ${templateIdInt}`);
      return res.status(403).json({ message: 'Cannot like private template' });
    }
    
    const [like, created] = await Like.findOrCreate({
      where: { templateId: templateIdInt, userId: req.user.id }
    });
    
    console.log(`[LIKES] Like ${created ? 'created' : 'already existed'} for user ${req.user.id} on template ${templateIdInt}`);
    res.status(201).json({ liked: created, likeId: like.id });
  } catch (err) {
    console.error('[LIKES] Error:', err);
    console.error('[LIKES] Error details:', {
      message: err.message,
      stack: err.stack,
      templateId,
      userId: req.user?.id
    });
    res.status(500).json({ 
      message: 'Error liking template', 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Remove like
router.delete('/', authenticateToken, async (req, res) => {
  const { templateId } = req.body;
  console.log(`[LIKES] User ${req.user.id} trying to unlike template ${templateId}`);
  
  try {
    // Validate templateId
    if (!templateId) {
      console.log(`[LIKES] No templateId provided for unlike`);
      return res.status(400).json({ message: 'Template ID is required' });
    }

    // Convert templateId to integer for consistency
    const templateIdInt = parseInt(templateId);
    if (isNaN(templateIdInt)) {
      console.log(`[LIKES] Invalid templateId for unlike: ${templateId}`);
      return res.status(400).json({ message: 'Invalid template ID format' });
    }

    const result = await Like.destroy({ 
      where: { templateId: templateIdInt, userId: req.user.id } 
    });
    
    console.log(`[LIKES] Removed ${result} like(s) for user ${req.user.id} on template ${templateIdInt}`);
    
    if (result === 0) {
      return res.status(404).json({ message: 'Like not found' });
    }
    
    res.json({ message: 'Like removed successfully', removed: result });
  } catch (err) {
    console.error('[LIKES] Error removing like:', err);
    console.error('[LIKES] Delete error details:', {
      message: err.message,
      stack: err.stack,
      templateId,
      userId: req.user?.id
    });
    res.status(500).json({ 
      message: 'Error removing like', 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

export default router;