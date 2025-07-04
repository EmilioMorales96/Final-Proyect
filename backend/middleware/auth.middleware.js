import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const router = express.Router();

export default async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Auth middleware: Authorization header:', authHeader);

  if (!token) {
    console.log('Auth middleware: No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware: Token decoded:', decoded);

    // Opcional: verifica que el usuario exista en la base de datos
    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      console.log('Auth middleware: User not found');
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    console.log('Auth middleware: Invalid token', err);
    return res.status(403).json({ message: 'Invalid token' });
  }
}

// Now the routes
router.put('/me', authenticateToken, (req, res) => {
  // logic to update the user's profile
});

router.put('/change-password', authenticateToken, (req, res) => {
  // logic to change the user's password
});

router.put('/avatar', authenticateToken, (req, res) => {
  // logic to update the user's avatar
});

export { router };
