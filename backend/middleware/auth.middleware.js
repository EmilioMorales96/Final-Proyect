import jwt from 'jsonwebtoken';
import db from '../models/index.js';

/**
 * Middleware to authenticate JWT tokens
 * Verifies the token and attaches user info to the request
 */
export default async function authenticateToken(req, res, next) {
  // Read token from cookie
  const token = req.cookies?.token;
  console.log('Auth middleware - Cookie:', token ? 'Token present' : 'No token');
  if (!token) {
    console.log('Auth middleware - No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Token decoded for user ID:', decoded.id);

    // Verify that the user exists in the database
    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      console.log('Auth middleware - User not found in database:', decoded.id);
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('Auth middleware - User found:', { id: user.id, role: user.role, isBlocked: user.isBlocked });

    // Check if user is blocked
    if (user.isBlocked) {
      console.log('Auth middleware - User is blocked:', user.id);
      return res.status(403).json({ 
        message: 'Your account has been blocked. Please contact an administrator.' 
      });
    }

    // Attach user info to request object
    req.user = { 
      id: user.id, 
      role: user.role, 
      isBlocked: user.isBlocked,
      username: user.username 
    };
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}
