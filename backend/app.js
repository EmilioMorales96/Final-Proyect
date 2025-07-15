import express from 'express';
import cors from 'cors';

// Import essential route modules
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import templateRoutes from './routes/template.routes.js';
import formRoutes from './routes/form.routes.js';

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

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Forms API is running', 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/forms', formRoutes);

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

