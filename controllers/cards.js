const Card = require('../models/card');

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: 'На сервере произошла ошибка' });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  const { _id: owner } = req.user;
  try {
    const card = await Card.create({ name, link, owner });
    res.status(201).json(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(BAD_REQUEST).json({
        message: 'Переданы некорректные данные при создании карточки',
      });
    }
    return res.status(SERVER_ERROR).json({ error: 'На сервере произошла ошибка' });
  }
  return res;
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'Карточка с указанным _id не найдена' });
    }
    res.json({ message: 'Карточка успешно удалена' });
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: 'На сервере произошла ошибка' });
  }
  return res;
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'Передан несуществующий _id карточки' });
    }
    res.json(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Переданы некорректные данные для постановки лайка' });
    }
    res.status(SERVER_ERROR).json({ error: 'На сервере произошла ошибка' });
  }
  return res;
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'Передан несуществующий _id карточки' });
    }
    res.json(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Переданы некорректные данные для снятия лайка' });
    }
    res.status(SERVER_ERROR).json({ error: 'На сервере произошла ошибка' });
  }
  return res;
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
