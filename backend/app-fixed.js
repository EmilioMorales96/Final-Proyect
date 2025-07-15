import express from 'express';
import cors from 'cors';
import db from './models/index.js';

// Import only essential routes to avoid path-to-regexp errors
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import likeRoutes from './routes/like.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://frontend-9ajm.onrender.com'
  ],
  credentials: true
}));

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

// Mount essential API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/likes', likeRoutes);

// Serve static files
app.use('/uploads', express.static('uploads'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

export default app;
