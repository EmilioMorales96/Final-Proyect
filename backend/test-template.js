import express from 'express';
import templateRoutes from './routes/template.routes.js';

const app = express();
app.use(express.json());

app.use('/api/templates', templateRoutes);

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Test server with template routes running on port ${PORT}`);
});
