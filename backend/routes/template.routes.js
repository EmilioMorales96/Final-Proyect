import express from 'express';
import db from '../models/index.js';
const { Template, Tag, User, Like, Comment } = db;
import { userHasAccess } from '../utils/access.js';
import authenticateToken from '../middleware/auth.middleware.js';
import { requireAdmin, requireResourceOwnershipOrAdmin } from '../middleware/authorization.middleware.js';

const router = express.Router();

// Debug route to check user authentication status
router.get('/debug/user', authenticateToken, async (req, res) => {
  try {
    console.log('Debug route - User info:', req.user);
    
    // Get full user details from database
    const fullUser = await User.findByPk(req.user.id);
    
    res.json({
      message: 'User authentication working',
      userFromToken: req.user,
      userFromDatabase: {
        id: fullUser.id,
        username: fullUser.username,
        role: fullUser.role,
        isBlocked: fullUser.isBlocked,
        createdAt: fullUser.createdAt,
        updatedAt: fullUser.updatedAt
      }
    });
  } catch (error) {
    console.error('Debug route error:', error);
    res.status(500).json({ 
      message: 'Error in debug route', 
      error: error.message,
      userInfo: req.user 
    });
  }
});

// Emergency route to unblock admin user (only use in emergency)
router.post('/debug/unblock-admin', async (req, res) => {
  try {
    const { email, adminKey } = req.body;
    
    // Simple admin key check (change this to something secure)
    if (adminKey !== 'emergency-unblock-2024') {
      return res.status(403).json({ message: 'Invalid admin key' });
    }
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'User is not an admin' });
    }
    
    await user.update({ isBlocked: false });
    
    res.json({ 
      message: 'Admin user unblocked successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked
      }
    });
  } catch (error) {
    console.error('Unblock admin error:', error);
    res.status(500).json({ 
      message: 'Error unblocking admin', 
      error: error.message 
    });
  }
});

// Debug endpoint to test user authentication
router.get('/debug/auth-test', authenticateToken, async (req, res) => {
  try {
    console.log('[TEMPLATE AUTH DEBUG] User authenticated successfully:', req.user);
    res.json({ 
      success: true, 
      message: 'Authentication working correctly',
      user: req.user,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[TEMPLATE AUTH DEBUG] Error:', error);
    res.status(500).json({ 
      message: 'Error in auth test', 
      error: error.message 
    });
  }
});

// Simple debug endpoint without authentication
router.post('/debug/simple-test', async (req, res) => {
  try {
    console.log('[TEMPLATE SIMPLE DEBUG] Testing basic template creation...');
    
    // Create a minimal test template without authentication
    const testTemplate = await Template.create({
      title: 'Debug Test Template',
      description: 'Debug test description',
      topic: 'Other',
      isPublic: true,
      authorId: 1, // Hardcoded for testing
      questions: [
        {
          title: 'Debug Question',
          questionText: 'This is a debug question',
          type: 'text',
          isRequired: false
        }
      ]
    });
    
    console.log('[TEMPLATE SIMPLE DEBUG] Test template created successfully:', testTemplate.id);
    res.json({ 
      success: true, 
      message: 'Simple test template created successfully', 
      templateId: testTemplate.id,
      templateData: testTemplate
    });
  } catch (error) {
    console.error('[TEMPLATE SIMPLE DEBUG] Error:', error);
    res.status(500).json({ 
      message: 'Error creating simple test template', 
      error: error.message,
      stack: error.stack
    });
  }
});

// Debug endpoint to test template creation with minimal data
router.post('/debug/test-create', authenticateToken, async (req, res) => {
  try {
    console.log('[TEMPLATE DEBUG] User info:', req.user);
    console.log('[TEMPLATE DEBUG] Request body:', req.body);
    
    // Create a minimal test template
    const testTemplate = {
      title: 'Test Template',
      description: 'Test Description',
      topic: 'Other',
      isPublic: true,
      questions: [
        {
          title: 'Test Question',
          questionText: 'This is a test question',
          type: 'text',
          isRequired: false
        }
      ]
    };
    
    const template = await Template.create({
      ...testTemplate,
      authorId: req.user.id
    });
    
    res.json({ 
      success: true, 
      message: 'Test template created successfully', 
      templateId: template.id 
    });
  } catch (error) {
    console.error('[TEMPLATE DEBUG] Error:', error);
    res.status(500).json({ 
      message: 'Error creating test template', 
      error: error.message 
    });
  }
});

// Create template (authenticated only) - COMPATIBLE WITH FRONTEND
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('[TEMPLATE] Creating template - User info:', req.user);
    console.log('[TEMPLATE] Request body:', JSON.stringify(req.body, null, 2));
    
    // Extract fields with frontend compatibility
    const { 
      title, 
      description, 
      topic,
      accessType,    // Frontend sends this instead of isPublic
      allowedUsers,  // Frontend sends this instead of accessUsers
      imageUrl, 
      tags, 
      questions,
      // Backwards compatibility
      isPublic,
      accessUsers
    } = req.body;

    // Convert frontend format to backend format
    const isPublicTemplate = accessType === 'public' || isPublic === true || isPublic === undefined;
    const accessUsersList = allowedUsers || accessUsers || [];

    console.log('[TEMPLATE] Checking title:', title);
    if (!title) {
      console.log('[TEMPLATE] ERROR: Title is missing');
      return res.status(400).json({ 
        message: 'Title is required.',
        received: { title, type: typeof title }
      });
    }
    
    console.log('[TEMPLATE] Checking description:', description);
    if (!description) {
      console.log('[TEMPLATE] ERROR: Description is missing');
      return res.status(400).json({ 
        message: 'Description is required.',
        received: { description, type: typeof description }
      });
    }

    // Make topic optional with default value
    const templateTopic = topic || 'Other';
    console.log('[TEMPLATE] Topic:', templateTopic);

    // Make questions optional with default empty array
    const templateQuestions = questions || [];
    console.log('[TEMPLATE] Questions:', templateQuestions);

    // If no questions provided, create a default one
    if (templateQuestions.length === 0) {
      templateQuestions.push({
        title: 'Default Question',
        questionText: 'Please provide your feedback',
        type: 'text',
        isRequired: false
      });
      console.log('[TEMPLATE] Added default question since none provided');
    }

    console.log('[TEMPLATE] All validations passed, creating template...');

    // Optional: Check question type limits (only if questions are provided)
    if (templateQuestions.length > 1) {
      console.log('[TEMPLATE] Validating question type limits...');
      const typeCounts = {};
      templateQuestions.forEach(q => {
        if (q.type) {
          typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;
        }
      });
      console.log('[TEMPLATE] Question type counts:', typeCounts);

      const limitedTypes = ['text', 'textarea', 'integer', 'checkbox'];
      const maxPerType = 4;
      
      for (const type of limitedTypes) {
        if (typeCounts[type] > maxPerType) {
          console.log(`[TEMPLATE] Validation failed: Too many questions of type ${type}: ${typeCounts[type]} > ${maxPerType}`);
          return res.status(400).json({ 
            message: `Maximum ${maxPerType} questions allowed for type: ${type}` 
          });
        }
      }
    }

    console.log('[TEMPLATE] All validations passed, creating template object...');
    
    // Template creation compatible with frontend format
    const templateData = {
      title: title.toString().trim(),
      description: description.toString().trim(),
      topic: templateTopic,
      imageUrl: imageUrl || null,
      isPublic: isPublicTemplate,
      accessUsers: Array.isArray(accessUsersList) ? JSON.stringify(accessUsersList) : null,
      authorId: req.user.id,
      questions: templateQuestions, // Store as JSON
    };
    
    console.log('[TEMPLATE] Template data to create:', templateData);
    
    const template = await Template.create(templateData);
    console.log('[TEMPLATE] Template created successfully with ID:', template.id);

    // Simplified tag handling - skip for now to avoid errors
    if (Array.isArray(tags) && tags.length > 0) {
      try {
        console.log('[TEMPLATE] Processing tags:', tags);
        const tagInstances = await Promise.all(
          tags.map(name =>
            db.Tag.findOrCreate({ where: { name: name.toString().trim().toLowerCase() } }).then(([tag]) => tag)
          )
        );
        await template.setTags(tagInstances);
        console.log('[TEMPLATE] Tags associated successfully');
      } catch (tagError) {
        console.warn('[TEMPLATE] Warning - Tag association failed:', tagError.message);
        // Continue without failing the template creation
      }
    }

    res.status(201).json(template);
  } catch (err) {
    console.error("Error creating template:", err);
    console.error("Error details:", err.message);
    if (err.name === 'SequelizeValidationError') {
      const validationErrors = err.errors.map(error => ({
        field: error.path,
        message: error.message
      }));
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationErrors 
      });
    }
    res.status(500).json({ message: 'Error creating template.', error: err.message });
  }
});

// Get all accessible templates
router.get('/', authenticateToken, async (req, res) => {
  console.log("User in /api/templates:", req.user);
  try {
    const templates = await db.Template.findAll({
      include: [
        {
          model: db.User,
          as: "FavoredBy",
          attributes: ["id"],
          through: { attributes: [] }
        },
        {
          model: db.Tag,
          as: "Tags", 
          through: { attributes: [] }
        },
        {
          model: db.User,
          as: "author", 
          attributes: ["id", "username", "avatar"]
        }
      ],
      order: [["updatedAt", "DESC"]]
    });

    // Filter templates based on user access
    // Show all public templates + private templates the user has access to
    const accessibleTemplates = templates.filter(template => {
      return template.isPublic || userHasAccess(template, req.user.id, req.user.role);
    });

    res.json(accessibleTemplates);
  } catch (err) {
    console.error("Error fetching templates:", err);
    res.status(500).json({ message: 'Error fetching templates', error: err.message });
  }
});

// Get recent templates for home page
router.get('/recent', async (req, res) => {
  try {
    console.log('[TEMPLATES] Fetching recent templates...');
    const templates = await Template.findAll({
      where: { isPublic: true },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        },
        {
          model: db.Tag,
          as: 'Tags',
          through: { attributes: [] },
          attributes: ['name']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 8
    });
    
    console.log(`[TEMPLATES] Found ${templates.length} recent templates`);
    res.json(templates);
  } catch (error) {
    console.error('Error fetching recent templates:', error);
    res.status(500).json({ message: 'Error fetching recent templates', error: error.message });
  }
});

// Get popular templates for home page
router.get('/popular', async (req, res) => {
  try {
    console.log('[TEMPLATES] Fetching popular templates...');
    
    // Simplified approach: get templates with basic info, then calculate popularity
    const templates = await Template.findAll({
      where: { isPublic: true },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        },
        {
          model: db.Tag,
          as: 'Tags',
          through: { attributes: [] },
          attributes: ['name']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 20 // Get more to then sort by popularity
    });

    // For now, return recent templates as "popular" 
    // TODO: Implement proper popularity calculation based on likes/comments
    const popularTemplates = templates.slice(0, 5);
    
    console.log(`[TEMPLATES] Found ${popularTemplates.length} popular templates`);
    res.json(popularTemplates);
  } catch (error) {
    console.error('Error fetching popular templates:', error);
    res.status(500).json({ message: 'Error fetching popular templates', error: error.message });
  }
});

// Get a template by ID (with access control)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    console.log(`[TEMPLATE] GET /:id - User ${req.user.id} requesting template ${req.params.id}`);
    const template = await Template.findByPk(req.params.id, {
      include: [
        {
          model: Tag,
          as: "Tags",
          through: { attributes: [] }
        },
        {
          model: db.User,
          as: "FavoredBy",
          attributes: ["id"],
          through: { attributes: [] }
        },
        {
          model: db.User,
          as: "author",
          attributes: ["id", "username", "avatar"]
        }
      ]
    });
    
    if (!template) {
      console.log(`[TEMPLATE] Template ${req.params.id} not found`);
      return res.status(404).json({ message: 'Template not found' });
    }

    console.log(`[TEMPLATE] Template found: ${template.title}, isPublic: ${template.isPublic}, authorId: ${template.authorId}`);
    
    if (template.isPublic || userHasAccess(template, req.user.id, req.user.role)) {
      console.log(`[TEMPLATE] Access granted to template ${req.params.id}`);
      return res.json(template);
    }
    
    console.log(`[TEMPLATE] Access denied to template ${req.params.id}`);
    return res.status(403).json({ message: 'You do not have access to this template.' });
  } catch (err) {
    console.error(`[TEMPLATE] Error fetching template ${req.params.id}:`, err);
    res.status(500).json({ message: 'Error fetching template.', error: err.message });
  }
});

// Update template (owner or admin only)
router.put('/:id', authenticateToken, requireResourceOwnershipOrAdmin('Template'), async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    const { tags, ...updateData } = req.body;
    await template.update(updateData);

    // Update tags association
    if (Array.isArray(tags)) {
      const tagInstances = await Promise.all(
        tags.map(name =>
          Tag.findOrCreate({ where: { name: name.trim().toLowerCase() } }).then(([tag]) => tag)
        )
      );
      await template.setTags(tagInstances);
    }

    const updatedTemplate = await Template.findByPk(req.params.id, {
      include: [
        { model: Tag, attributes: ['name'] },
        { model: User, as: 'author', attributes: ['username'] }
      ]
    });

    res.json({ 
      message: 'Template updated successfully', 
      template: updatedTemplate 
    });
  } catch (err) {
    console.error('Error updating template:', err);
    res.status(500).json({ message: 'Error updating template', error: err.message });
  }
});

// Delete template (owner or admin only)
router.delete('/:id', authenticateToken, requireResourceOwnershipOrAdmin('Template'), async (req, res) => {
  try {
    const template = await Template.findByPk(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    await template.destroy();
    res.json({ message: 'Template deleted successfully' });
  } catch (err) {
    console.error('Error deleting template:', err);
    res.status(500).json({ message: 'Error deleting template', error: err.message });
  }
});

// Get template analytics (owner/admin only)
router.get('/:id/analytics', authenticateToken, async (req, res) => {
  try {
    const templateId = req.params.id;
    const template = await Template.findByPk(templateId);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Check if user has access to view analytics
    if (template.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get all forms for this template
    const forms = await db.Form.findAll({
      where: { templateId },
      include: [{ model: db.User, attributes: ['id'] }]
    });

    const analytics = {
      totalResponses: forms.length,
      uniqueUsers: new Set(forms.map(f => f.userId)).size,
      completionRate: 100, // Could calculate based on partial submissions
      averageCompletionTime: Math.round(Math.random() * 120 + 30), // Mock data
      questionAnalytics: [],
      timeline: []
    };

    // Analyze question responses
    if (template.questions && Array.isArray(template.questions)) {
      template.questions.forEach((question, index) => {
        const questionResponses = forms
          .map(form => form.answers && form.answers[`question_${index}`])
          .filter(answer => answer !== undefined && answer !== null && answer !== '');

        const questionAnalysis = {
          questionText: question.questionText || question.title,
          type: question.type,
          totalResponses: questionResponses.length
        };

        if (['radio', 'checkbox', 'dropdown'].includes(question.type)) {
          // Analyze categorical data
          const distribution = {};
          questionResponses.forEach(answer => {
            if (Array.isArray(answer)) {
              answer.forEach(item => {
                distribution[item] = (distribution[item] || 0) + 1;
              });
            } else {
              distribution[answer] = (distribution[answer] || 0) + 1;
            }
          });
          
          questionAnalysis.distribution = Object.entries(distribution)
            .map(([value, count]) => ({ value, count }))
            .sort((a, b) => b.count - a.count);
            
        } else if (['rating', 'linear'].includes(question.type)) {
          // Analyze numeric data
          const numericResponses = questionResponses
            .map(answer => parseInt(answer))
            .filter(num => !isNaN(num));
            
          const distribution = {};
          numericResponses.forEach(num => {
            distribution[num] = (distribution[num] || 0) + 1;
          });
          
          questionAnalysis.distribution = Object.entries(distribution)
            .map(([value, count]) => ({ value: parseInt(value), count }))
            .sort((a, b) => a.value - b.value);
            
          questionAnalysis.average = numericResponses.length > 0 
            ? (numericResponses.reduce((sum, num) => sum + num, 0) / numericResponses.length).toFixed(2)
            : 0;
            
        } else {
          // Analyze text data
          const lengths = questionResponses.map(answer => String(answer).length);
          questionAnalysis.averageLength = lengths.length > 0 
            ? Math.round(lengths.reduce((sum, len) => sum + len, 0) / lengths.length)
            : 0;
            
          // Find most common answer (simplified)
          const answerCounts = {};
          questionResponses.forEach(answer => {
            const normalized = String(answer).toLowerCase().trim();
            answerCounts[normalized] = (answerCounts[normalized] || 0) + 1;
          });
          
          const mostCommonEntry = Object.entries(answerCounts)
            .sort(([,a], [,b]) => b - a)[0];
          questionAnalysis.mostCommon = mostCommonEntry ? mostCommonEntry[0] : 'N/A';
        }

        analytics.questionAnalytics.push(questionAnalysis);
      });
    }

    // Generate timeline data (last 30 days)
    const timeline = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayResponses = forms.filter(form => {
        const formDate = new Date(form.createdAt).toISOString().split('T')[0];
        return formDate === dateStr;
      }).length;
      
      timeline.push({
        date: dateStr,
        responses: dayResponses
      });
    }
    analytics.timeline = timeline;

    res.json(analytics);
  } catch (error) {
    console.error('Error generating analytics:', error);
    res.status(500).json({ message: 'Error generating analytics' });
  }
});

export default router;
