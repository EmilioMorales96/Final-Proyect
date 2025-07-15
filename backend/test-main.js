import express from 'express';
import authRoutes from './routes/auth.routes.js';
import templateRoutes from './routes/template.routes.js';
import formRoutes from './routes/form.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/users', userRoutes);

const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Test server with main routes running on port ${PORT}`);
});
