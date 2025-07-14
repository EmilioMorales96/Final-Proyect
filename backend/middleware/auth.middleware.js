import jwt from 'jsonwebtoken';
import db from '../models/index.js';

/**
 * Middleware to authenticate JWT tokens
 * Verifies the token and attaches user info to the request
 */
export default async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify that the user exists in the database
    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user info to request object
    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}
