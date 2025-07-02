import express from 'express';
import cors from 'cors';
import db from './models/index.js';

// Import all routes
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import questionRoutes from './routes/question.routes.js';
import formRoutes from './routes/form.routes.js';
import templateRoutes from './routes/template.routes.js';
import commentRoutes from './routes/comment.routes.js';
import likeRoutes from './routes/like.routes.js';
import tagRoutes from './routes/tag.routes.js';

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

console.log("Mounting routes...");

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/tags', tagRoutes);

// Serve static files from the "uploads" folder
app.use('/uploads', express.static('uploads'));

// Handle not found routes
app.use((req, res, next) => {
  console.warn(`[404] Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});


import tagsRouter from './routes/tag.routes.js';
app.use('/api/tags', tagsRouter);

await db.sequelize.sync();

export default app;

