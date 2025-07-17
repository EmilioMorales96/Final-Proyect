import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport.js';
import db from './models/index.js';

// Essential routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import likeRoutes from './routes/like.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import commentRoutes from './routes/comment.routes.js';
import templateRoutes from './routes/template.routes.js';
import tagRoutes from './routes/tag.routes.js';
import formRoutes from './routes/form.routes.js';
import emailRoutes from './routes/email.routes.js';
import supportRoutes from './routes/support.routes.js';

// Salesforce routes
import salesforceRoutes from './routes/salesforce.routes.js';
import salesforceLogoutRoutes from './routes/salesforce-logout.routes.js';
import salesforceBattleRoutes from './routes/salesforce-battle.routes.js';
import salesforceRedirectFixRoutes from './routes/salesforce-redirect-fix.routes.js';

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

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoints
app.get('/', (req, res) => {
  res.json({ 
    message: 'Forms API is running', 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

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

// OAuth status endpoint
app.get('/api/auth/oauth/status', (req, res) => {
  res.json({
    google: {
      available: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/support', supportRoutes);

// Salesforce Routes
app.use('/api/salesforce', salesforceRoutes);
app.use('/api/salesforce/auth', salesforceLogoutRoutes);
app.use('/api/salesforce', salesforceBattleRoutes);
app.use('/api/salesforce/redirect-fix', salesforceRedirectFixRoutes);

// Static files
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
