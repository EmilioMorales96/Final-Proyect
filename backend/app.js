import express from 'express';
import cors from 'cors';
import db from './models/index.js';

console.log("Importing user.routes.js");
import userRoutes from './routes/user.routes.js';

console.log("Importing auth.routes.js");
import authRoutes from './routes/auth.routes.js';

console.log("Importing question.routes.js");
import questionRoutes from './routes/question.routes.js';

console.log("Importing form.routes.js");
import formRoutes from './routes/form.routes.js';

console.log("Importing template.routes.js");
import templateRoutes from './routes/template.routes.js';

console.log("Importing comment.routes.js");
import commentRoutes from './routes/comment.routes.js';

console.log("Importing like.routes.js");
import likeRoutes from './routes/like.routes.js';

console.log("Importing tag.routes.js");
import tagRoutes from './routes/tag.routes.js';

console.log("Importing favorite.routes.js");
import favoriteRoutes from './routes/favorite.routes.js';
import searchRoutes from './routes/search.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import salesforceRoutes from './routes/salesforce.routes.js';
import externalRoutes from './routes/external.routes.js';
import supportRoutes from './routes/support.routes.js';

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

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/forms', formRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/salesforce', salesforceRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/support', supportRoutes);

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Handle 404 errors for unknown routes
app.use((req, res, next) => {
  console.warn(`[404] Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Synchronize database models
await db.sequelize.sync();

export default app;

