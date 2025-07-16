import express from 'express';
import cors from 'cors';

const app = express();

// Enable JSON parsing middleware
app.use(express.json());

// Enable CORS with environment-specific configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://forms-frontend-r1d5.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

export default app;
