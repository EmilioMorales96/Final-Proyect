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
import favoriteRoutes from './routes/favorite.routes.js';

const app = express();

app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173', // desarrollo local
    'https://frontend-9ajm.onrender.com' // production URL
  ],
  credentials: true
}));
app.options('*', cors());

console.log("Mounting routes...");

// Mount routes
console.log("Mounting /api/auth");
app.use('/api/auth', authRoutes);

console.log("Mounting /api/users");
app.use('/api/users', userRoutes); 

console.log("Mounting /api/forms");
app.use('/api/forms', formRoutes);

console.log("Mounting /api/templates");
app.use('/api/templates', templateRoutes);

console.log("Mounting /api/questions");
app.use('/api/questions', questionRoutes);

console.log("Mounting /api/comments");
app.use('/api/comments', commentRoutes);

console.log("Mounting /api/likes");
app.use('/api/likes', likeRoutes);

console.log("Mounting /api/tags");
app.use('/api/tags', tagRoutes);

console.log("Mounting /api/favorites");
app.use('/api/favorites', favoriteRoutes);

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

await db.sequelize.sync();

export default app;

