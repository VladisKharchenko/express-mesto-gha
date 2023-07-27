const express = require('express');
const { celebrate, Joi } = require('celebrate');

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

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().min(2).max(30).required(),
        about: Joi.string().min(2).max(30).required(),
      })
      .unknown(true),
  }),
  updateUserProfile,
);

router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object()
      .keys({
        avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
      })
      .unknown(true),
  }),
  updateUserAvatar,
);

router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object()
      .keys({
        userId: Joi.string().hex().length(24).required(),
      })
      .unknown(true),
  }),
  getUserById,
);

module.exports = router;
