const User = require('../models/user');

const ERROR_CODE = 400;
const ERROR_CODE_2 = 500;
const ERROR_CODE_3 = 404;

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(ERROR_CODE_2).json({ error: 'На сервере произошла ошибка' });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(ERROR_CODE_3).json({ error: 'Пользователь по указанному _id не найден' });
    }
    res.json(user);
  } catch (error) {
    res.status(ERROR_CODE_2).json({ error: 'На сервере произошла ошибка' });
  }
  return res;
};

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    res.status(201).json(user);
  } catch (error) {
    if (error.name === 'SomeErrorName') {
      return res.status(ERROR_CODE).json({ error: 'Переданы некорректные данные при создание пользователя' });
    }
    res.status(500).json({ error: 'На сервере произошла ошибка' });
  }
  return res;
};

const updateUserProfile = async (req, res) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true },
    );
    if (!user) {
      return res.status(ERROR_CODE_3).json({ error: 'Пользователь с указанным _id не найден' });
    }
    res.json(user);
  } catch (error) {
    if (error.name === 'SomeErrorName') {
      return res.status(ERROR_CODE).json({ error: 'Переданы некорректные данные при обновлении профиля' });
    }
    res.status(ERROR_CODE_2).json({ error: 'На сервере произошла ошибка' });
  }
  return res;
};

const updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  try {
    if (!avatar) {
      return res.status(ERROR_CODE).json({ error: 'Переданы некорректные данные при обновлении аватара' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true },
    );
    if (!user) {
      return res.status(ERROR_CODE_3).json({ error: 'Пользователь с указанным _id не найден' });
    }
    res.json(user);
  } catch (error) {
    res.status(ERROR_CODE_2).json({ error: 'На сервере произошла ошибка' });
  }
  return res;
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
