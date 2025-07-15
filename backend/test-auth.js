import express from 'express';
import authRoutes from './routes/auth.routes.js';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Test server with auth routes running on port ${PORT}`);
});
