const User = require('../models/user');

const CREATED_SUCCESSFULLY = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(SERVER_ERROR).json({ error: 'На сервере произошла ошибка' });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(NOT_FOUND)
        .json({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.json(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return res
        .status(BAD_REQUEST)
        .json({ message: 'Некорректный формат _id пользователя' });
    }
    return res.status(SERVER_ERROR).json({ error: 'На сервере произошла ошибка' });
  }
};

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    return res.status(CREATED_SUCCESSFULLY).json(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(BAD_REQUEST).json({
        message: 'Переданы некорректные данные при создании пользователя',
      });
    }
    return res.status(SERVER_ERROR).json({ error: 'На сервере произошла ошибка' });
  }
};

const updateUserProfile = async (req, res) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(NOT_FOUND).json({ message: 'Пользователь с указанным _id не найден' });
    }
    return res.json(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(BAD_REQUEST).json({
        message: 'Переданы некорректные данные при создании пользователя',
      });
    }
    return res.status(SERVER_ERROR).json({ error: 'На сервере произошла ошибка' });
  }
};

const updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  try {
    if (!avatar) {
      return res
        .status(BAD_REQUEST)
        .json({ error: 'Переданы некорректные данные при обновлении аватара' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res
        .status(NOT_FOUND)
        .json({ error: 'Пользователь с указанным _id не найден' });
    }
    return res.json(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(BAD_REQUEST)
        .json({ error: 'Ошибка валидации данных при обновлении аватара' });
    }
    return res.status(SERVER_ERROR).json({ error: 'На сервере произошла ошибка' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
