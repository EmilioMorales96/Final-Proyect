import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './models/index.js';

// Load environment variables
dotenv.config();

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

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Clean Forms API is running', 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ message: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// Basic auth route for testing
app.post('/api/auth/test', async (req, res) => {
  res.json({ message: 'Auth endpoint working' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const startServer = async () => {
  try {
    console.log('🔄 Starting clean server...');
    
    // Sync database
    await db.sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully!');
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Clean server running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/`);
      console.log(`🔍 Database test: http://localhost:${PORT}/test-db`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
