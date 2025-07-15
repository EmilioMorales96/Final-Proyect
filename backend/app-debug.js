import express from 'express';
import cors from 'cors';
import db from './models/index.js';

const app = express();

// Enable JSON parsing middleware
app.use(express.json());

// Configure CORS for frontend communication
app.use(cors({
  origin: [
    'http://localhost:5173', // Local development
    'https://frontend-9ajm.onrender.com' // Production URL
  ],
  credentials: true
}));
app.options('*', cors());

// Basic health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Forms API is running', 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ 
      message: 'Database connection successful',
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection failed',
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Import routes one by one to identify which one is causing the problem
try {
  console.log('Loading auth routes...');
  const authRoutes = await import('./routes/auth.routes.js');
  app.use('/api/auth', authRoutes.default);
  console.log('✓ Auth routes loaded');
} catch (error) {
  console.error('❌ Error loading auth routes:', error);
}

try {
  console.log('Loading user routes...');
  const userRoutes = await import('./routes/user.routes.js');
  app.use('/api/users', userRoutes.default);
  console.log('✓ User routes loaded');
} catch (error) {
  console.error('❌ Error loading user routes:', error);
}

try {
  console.log('Loading template routes...');
  const templateRoutes = await import('./routes/template.routes.js');
  app.use('/api/templates', templateRoutes.default);
  console.log('✓ Template routes loaded');
} catch (error) {
  console.error('❌ Error loading template routes:', error);
}

try {
  console.log('Loading form routes...');
  const formRoutes = await import('./routes/form.routes.js');
  app.use('/api/forms', formRoutes.default);
  console.log('✓ Form routes loaded');
} catch (error) {
  console.error('❌ Error loading form routes:', error);
}

try {
  console.log('Loading tag routes...');
  const tagRoutes = await import('./routes/tag.routes.js');
  app.use('/api/tags', tagRoutes.default);
  console.log('✓ Tag routes loaded');
} catch (error) {
  console.error('❌ Error loading tag routes:', error);
}

try {
  console.log('Loading like routes...');
  const likeRoutes = await import('./routes/like.routes.js');
  app.use('/api/likes', likeRoutes.default);
  console.log('✓ Like routes loaded');
} catch (error) {
  console.error('❌ Error loading like routes:', error);
}

// Debug endpoint for likes system
app.get('/debug/likes', async (req, res) => {
  try {
    const { Like, Template, User } = db;
    
    // Get basic statistics
    const likeCount = await Like.count();
    const templateCount = await Template.count();
    const userCount = await User.count();
    
    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      statistics: {
        totalLikes: likeCount,
        totalTemplates: templateCount,
        totalUsers: userCount
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDbConnection: true
      }
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Debug endpoint failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Handle 404 errors for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

export default app;
