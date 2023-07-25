const Card = require('../models/card');

const CREATED_SUCCESSFULLY = 201;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find();
    return res.json(cards);
  } catch (error) {
    return next(error);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const { _id: owner } = req.user;
  try {
    const card = await Card.create({ name, link, owner });
    return res.status(CREATED_SUCCESSFULLY).json(card);
  } catch (error) {
    return next(error);
  }
};

const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'Карточка с указанным _id не найдена' });
    }
    if (card.owner.toString() !== req.user._id) {
      return res
        .status(UNAUTHORIZED)
        .json({ message: 'У вас нет прав для удаления этой карточки' });
    }
    await card.deleteOne();
    return res.json({ message: 'Карточка успешно удалена' });
  } catch (error) {
    return next(error);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'Передан несуществующий _id карточки' });
    }
    return res.json(card);
  } catch (error) {
    return next(error);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'Передан несуществующий _id карточки' });
    }
    return res.json(card);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
