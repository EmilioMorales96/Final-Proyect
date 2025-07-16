import express from 'express';
const router = express.Router();
import db from '../models/index.js';
const { User } = db;
import authenticateToken from '../middleware/auth.middleware.js';
import authenticateTokenForStatus from '../middleware/auth-status.middleware.js';
import { requireAdmin, requireOwnershipOrAdmin } from '../middleware/authorization.middleware.js';
import multer from 'multer';
import path from 'path';
import { Op } from 'sequelize';
import crypto from 'crypto';

// Multer configuration for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    cb(null, req.user.id + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Get authenticated user's profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'role', 'isBlocked', 'avatar', 'createdAt']
    });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile.', error: err.message });
  }
});

// Get authenticated user's status (for real-time monitoring)
// Uses special middleware that allows blocked users to get their status
router.get('/me/status', authenticateTokenForStatus, async (req, res) => {
  try {
    console.log('📊 [Status Endpoint] User requesting status:', req.user.id, 'Blocked:', req.user.isBlocked);
    
    // Return the blocking status directly from the authenticated user info
    res.json({ 
      isBlocked: req.user.isBlocked,
      userId: req.user.id 
    });
  } catch (err) {
    console.error('❌ [Status Endpoint] Error:', err);
    res.status(500).json({ message: 'Error fetching user status.', error: err.message });
  }
});

// Update profile (username and email)
router.put('/me', authenticateToken, async (req, res) => {
  const { username, email } = req.body;
  try {
    const [updated] = await User.update(
      { username, email },
      { where: { id: req.user.id } }
    );
    if (!updated) return res.status(404).json({ message: 'User not found.' });
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile.', error: err.message });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error changing password.', error: err.message });
  }
});

// Upload avatar
router.put('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  try {
    const [updated] = await User.update(
      { avatar: avatarUrl },
      { where: { id: req.user.id } }
    );
    if (!updated) return res.status(404).json({ message: 'User not found.' });
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading avatar.', error: err.message });
  }
});

// Obtener todos los usuarios (solo admins pueden ver)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'isBlocked', 'createdAt', 'avatar']
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// Block user (admin only)
router.put('/admin/:id/block', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ message: "You can't block yourself." });
    }
    
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    await User.update({ isBlocked: true }, { where: { id: req.params.id } });
    return res.status(200).json({ 
      message: `User ${user.username} has been blocked successfully.` 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error blocking user.', error: err.message });
  }
});

// Unblock user (admin only)
router.put('/admin/:id/unblock', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    await User.update({ isBlocked: false }, { where: { id: req.params.id } });
    res.json({ 
      message: `User ${user.username} has been unblocked successfully.` 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error unblocking user.', error: err.message });
  }
});

// Delete user (admin only)
router.delete('/admin/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ message: "You can't delete yourself." });
    }
    
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: `User ${user.username} has been deleted successfully.` });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user.', error: err.message });
  }
});

// Promote user to admin (admin only)
router.put('/admin/:id/promote', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'User is already an admin.' });
    }
    
    await User.update({ role: 'admin' }, { where: { id: req.params.id } });
    res.json({ message: `${user.username} has been promoted to admin.` });
  } catch (err) {
    res.status(500).json({ message: 'Error promoting user.', error: err.message });
  }
});

// Demote admin to user (admin only)
router.put('/admin/:id/demote', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const adminCount = await User.count({ where: { role: 'admin' } });
    if (adminCount <= 1 && parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ 
        message: 'Cannot demote yourself when you are the only admin. There must be at least one admin.' 
      });
    }
    
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    if (user.role !== 'admin') {
      return res.status(400).json({ message: 'User is not an admin.' });
    }
    
    await User.update({ role: 'user' }, { where: { id: req.params.id } });
    res.json({ message: `${user.username}'s admin privileges have been removed.` });
  } catch (err) {
    res.status(500).json({ message: 'Error demoting user.', error: err.message });
  }
});

// Change role (toggle admin/user, admin only)
router.patch('/:id/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    
    // Check if trying to demote the last admin
    if (user.role === 'admin' && newRole === 'user') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount <= 1) {
        return res.status(400).json({ 
          message: 'Cannot remove the last admin. There must be at least one admin.' 
        });
      }
    }
    
    user.role = newRole;
    await user.save();
    res.json({ 
      message: `${user.username}'s role changed to ${newRole}.` 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error changing role.', error: err.message });
  }
});

// Autocomplete users by username or email (authenticated users only)
router.get('/autocomplete', authenticateToken, async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.status(400).json({ message: 'Missing or too short search parameter.' });

  try {
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.iLike]: `%${q}%` } },
          { email: { [Op.iLike]: `%${q}%` } }
        ]
      },
      attributes: ['id', 'username', 'email'],
      limit: 10
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error in autocomplete.', error: err.message });
  }
});

/**
 * Generate API token for external integrations
 * POST /api/users/generate-token
 */
router.post('/generate-token', authenticateToken, async (req, res) => {
  try {
    // Generate a secure random token
    const apiToken = crypto.randomBytes(32).toString('hex');
    
    // Update user with the new API token
    await User.update(
      { apiToken },
      { where: { id: req.user.id } }
    );

    res.json({ 
      message: 'API token generated successfully',
      apiToken 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error generating API token.', error: err.message });
  }
});

// Check if user is admin or the owner of the resource
// router.use('/:id', authenticateToken, async (req, res, next) => {
//   const form = await User.findByPk(req.params.id);
//   if (!form) return res.status(404).json({ message: 'User not found.' });
//   // If not admin, check if the user is the owner of the resource
//   if (form.id !== req.user.id && req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Forbidden.' });
//   }
//   next();
// });

export default router;
