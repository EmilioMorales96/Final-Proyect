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

// Only load essential routes first
console.log('🔄 Loading essential routes...');

// Load auth routes
console.log('Loading auth routes...');
import authRoutes from './routes/auth.routes.js';
app.use('/api/auth', authRoutes);
console.log('✓ Auth routes loaded');

// Load user routes
console.log('Loading user routes...');
import userRoutes from './routes/user.routes.js';
app.use('/api/users', userRoutes);
console.log('✓ User routes loaded');

// Load like routes (our fixed ones)
console.log('Loading like routes...');
import likeRoutes from './routes/like.routes.js';
app.use('/api/likes', likeRoutes);
console.log('✓ Like routes loaded');

// Debug endpoint for likes system
app.get('/debug/likes', async (req, res) => {
  try {
    const { Like, Template, User } = db;
    
    // Get basic statistics
    const likeCount = await Like.count();
    const templateCount = await Template.count();
    const userCount = await User.count();
    
    // Test a simple like query
    const recentLikes = await Like.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'username'] },
        { model: Template, attributes: ['id', 'title'] }
      ]
    });
    
    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      statistics: {
        totalLikes: likeCount,
        totalTemplates: templateCount,
        totalUsers: userCount
      },
      recentLikes: recentLikes.length,
      sampleLikes: recentLikes,
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

console.log('✅ Essential routes loaded successfully');

export default app;

