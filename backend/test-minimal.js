import express from 'express';

const app = express();
app.use(express.json());

// Test simple route
app.get('/', (req, res) => {
  res.json({ message: 'Server is working' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
