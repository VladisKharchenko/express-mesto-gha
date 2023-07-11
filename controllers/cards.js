const Card = require('../models/card');

const ERROR_CODE_1 = 400;
const ERROR_CODE_2 = 500;
const ERROR_CODE_3 = 404;

const getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res.status(ERROR_CODE_2).json({ error: 'На сервере произошла ошибка' });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  const { _id: owner } = req.user;
  try {
    const card = await Card.create({ name, link, owner });
    res.status(201).json(card);
  } catch (error) {
    res.status(ERROR_CODE_1).json({ error: 'Переданы некорректные данные при создании карточки' });
  }
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      return res.status(ERROR_CODE_3).json({ error: 'Карточка с указанным _id не найдена' });
    }
    res.json({ message: 'Карточка успешно удалена' });
  } catch (error) {
    res.status(ERROR_CODE_2).json({ error: 'На сервере произошла ошибка' });
  }
  return res;
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(ERROR_CODE_3).json({ error: 'Передан несуществующий _id карточки' });
    }
    res.json(card);
  } catch (error) {
    if (error.name === 'SomeErrorName') {
      return res.status(ERROR_CODE_1).json({ error: 'Переданы некорректные данные для постановки лайка' });
    }
    res.status(ERROR_CODE_2).json({ error: 'На сервере произошла ошибка' });
  }
  return res;
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(ERROR_CODE_3).json({ error: 'Передан несуществующий _id карточки' });
    }
    res.json(card);
  } catch (error) {
    if (error.name === 'SomeErrorName') {
      return res.status(ERROR_CODE_1).json({ error: 'Переданы некорректные данные для снятия лайка' });
    }
    res.status(ERROR_CODE_2).json({ error: 'На сервере произошла ошибка' });
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
