import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

export default function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(`[AUTH] Authorization header:`, authHeader);
  if (!token) {
    console.warn("[AUTH] No token provided");
    return res.status(401).json({ message: 'Token required.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, user) => {
    if (err) {
      console.warn("[AUTH] Invalid token");
      return res.status(403).json({ message: 'Invalid token.' });
    }
    req.user = user;
    console.log("[AUTH] Valid token, user:", user);
    next();
  });
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
