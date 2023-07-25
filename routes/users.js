const express = require('express');

const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');
const authMiddleware = require('../middlewares/auth');

router.get('/users', getUsers);

router.get('/users/me', authMiddleware, getCurrentUser);

router.patch('/users/me', updateUserProfile);

router.patch('/users/me/avatar', updateUserAvatar);

router.get('/users/:userId', getUserById);

module.exports = router;
