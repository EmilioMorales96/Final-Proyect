import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import db from './models/index.js';

// Load environment variables
dotenv.config();

// Import essential routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://frontend-9ajm.onrender.com'
  ],
  credentials: true
}));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Forms API is running', 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test database connection
app.get('/api/health', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ 
      message: 'Database connection successful',
      status: 'healthy'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection failed',
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

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

/**
 * Start the server and synchronize database
 */
const startServer = async () => {
  try {
    console.log('🔄 Starting server...');
    
    // Try to sync database, but don't fail if it's not available locally
    try {
      await db.sequelize.sync({ alter: true });
      console.log("✅ Database synced successfully!");
    } catch (dbError) {
      console.warn("⚠️  Database connection failed (this is normal for local development):");
      console.warn(dbError.message);
      console.warn("⚠️  Server will start without database connection");
    }
    
    // Start the server regardless of database connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/`);
      console.log(`🗄️  Database health: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
      console.log(`👤 User endpoints: http://localhost:${PORT}/api/users`);
      console.log('\n💡 Tip: This server will work without database for testing routes');
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();