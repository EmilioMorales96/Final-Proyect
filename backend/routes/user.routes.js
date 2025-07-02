import express from 'express';
const router = express.Router();
import db from '../models/index.js';
const { User } = db;
import authenticateToken from '../middleware/auth.middleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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

// Middleware to check admin role
function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only.' });
  next();
}

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

// List all users (admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users.', error: err.message });
  }
});

// Block user (admin only)
router.patch('/:id/block', authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    user.isBlocked = true;
    await user.save();
    res.json({ message: 'User blocked.' });
  } catch (err) {
    res.status(500).json({ message: 'Error blocking user.', error: err.message });
  }
});

// Unblock user (admin only)
router.patch('/:id/unblock', authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    user.isBlocked = false;
    await user.save();
    res.json({ message: 'User unblocked.' });
  } catch (err) {
    res.status(500).json({ message: 'Error unblocking user.', error: err.message });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    await user.destroy();
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user.', error: err.message });
  }
});

// Change role (toggle admin/user, admin only)
router.patch('/:id/admin', authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();
    res.json({ message: `Role changed to ${user.role}.` });
  } catch (err) {
    res.status(500).json({ message: 'Error changing role.', error: err.message });
  }
});

// Autocomplete users by username or email (authenticated users only)
router.get('/autocomplete', authenticateToken, async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Missing search parameter.' });

  try {
    const users = await User.findAll({
      where: {
        [User.sequelize.Op.or]: [
          { username: { [User.sequelize.Op.like]: `%${q}%` } },
          { email: { [User.sequelize.Op.like]: `%${q}%` } }
        ]
      },
      attributes: ['id', 'username', 'email']
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error in autocomplete.', error: err.message });
  }
});

export default router;
