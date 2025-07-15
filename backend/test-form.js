import express from 'express';
import formRoutes from './routes/form.routes.js';

const app = express();
app.use(express.json());

app.use('/api/forms', formRoutes);

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Test server with form routes running on port ${PORT}`);
});
