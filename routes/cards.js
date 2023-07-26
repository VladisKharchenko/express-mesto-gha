const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post(
  '/cards',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().min(2).max(30).required(),
        link: Joi.string().required(),
      })
      .unknown(true),
  }),
  createCard,
);

router.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().required(),
      })
      .unknown(true),
  }),
  deleteCard,
);

router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().required(),
      })
      .unknown(true),
  }),
  likeCard,
);

router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().required(),
      })
      .unknown(true),
  }),
  dislikeCard,
);

module.exports = router;
