import jwt from 'jsonwebtoken';
import db from '../models/index.js';

/**
 * Special authentication middleware for user status endpoint
 * Allows blocked users to get their status information
 */
export default async function authenticateTokenForStatus(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Status Auth middleware - Headers:', req.headers['authorization'] ? 'Token present' : 'No token');

  if (!token) {
    console.log('Status Auth middleware - No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Status Auth middleware - Token decoded for user ID:', decoded.id);

    // Verify that the user exists in the database
    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      console.log('Status Auth middleware - User not found in database:', decoded.id);
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('Status Auth middleware - User found:', { id: user.id, role: user.role, isBlocked: user.isBlocked });

    // NO BLOQUEAR usuarios bloqueados aquí - el endpoint necesita devolver el estado
    // Attach user info to request object INCLUDING blocked status
    req.user = { 
      id: user.id, 
      role: user.role, 
      isBlocked: user.isBlocked,
      username: user.username 
    };
    next();
  } catch (err) {
    console.log('Status Auth middleware - Token verification failed:', err.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
}
