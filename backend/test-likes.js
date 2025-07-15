/**
 * Test script para debuggear el problema de likes
 * Ejecutar con: node test-likes.js
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './models/index.js';
import authenticateToken from './middleware/auth.middleware.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { Like, Template, User } = db;

// Test endpoint para debuggear likes
app.post('/test-likes', authenticateToken, async (req, res) => {
  console.log('=== DEBUGGING LIKES ===');
  console.log('Request body:', req.body);
  console.log('User from token:', req.user);
  
  const { templateId } = req.body;
  
  try {
    // 1. Verificar que templateId existe
    console.log('1. Checking if templateId is provided:', templateId);
    if (!templateId) {
      return res.status(400).json({ 
        error: 'templateId is required',
        received: templateId 
      });
    }
    
    // 2. Verificar que el template existe
    console.log('2. Looking for template with ID:', templateId);
    const template = await Template.findByPk(templateId);
    console.log('Template found:', template ? 'YES' : 'NO');
    
    if (!template) {
      return res.status(404).json({ 
        error: 'Template not found',
        templateId: templateId 
      });
    }
    
    // 3. Verificar permisos
    console.log('3. Checking permissions:');
    console.log('Template isPublic:', template.isPublic);
    console.log('Template authorId:', template.authorId);
    console.log('Current user ID:', req.user.id);
    console.log('User role:', req.user.role);
    
    if (!template.isPublic && template.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Cannot like private template',
        templateIsPublic: template.isPublic,
        templateAuthorId: template.authorId,
        currentUserId: req.user.id,
        userRole: req.user.role
      });
    }
    
    // 4. Intentar crear el like
    console.log('4. Attempting to create like...');
    const [like, created] = await Like.findOrCreate({
      where: { templateId: parseInt(templateId), userId: req.user.id }
    });
    
    console.log('Like operation result:');
    console.log('Like object:', like.toJSON());
    console.log('Was created (not existed before):', created);
    
    // 5. Contar likes actuales
    const totalLikes = await Like.count({ where: { templateId: parseInt(templateId) } });
    console.log('Total likes for template:', totalLikes);
    
    res.json({ 
      success: true,
      like: like.toJSON(),
      created: created,
      totalLikes: totalLikes,
      debug: {
        templateId: templateId,
        userId: req.user.id,
        templateExists: !!template,
        templateIsPublic: template.isPublic
      }
    });
    
  } catch (error) {
    console.error('ERROR in test-likes:', error);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: error.stack,
      details: {
        templateId: templateId,
        userId: req.user?.id,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Test endpoint sin autenticación para verificar conectividad
app.get('/test-health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: db.sequelize.options.database,
    host: db.sequelize.options.host
  });
});

const PORT = process.env.PORT || 3001;

// Sincronizar base de datos y iniciar servidor
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🔧 Test server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/test-health`);
    console.log(`💖 Like test: POST http://localhost:${PORT}/test-likes`);
  });
}).catch(err => {
  console.error('Error syncing database:', err);
});
