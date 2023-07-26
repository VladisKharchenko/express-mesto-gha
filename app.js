const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const handleErrors = require('./middlewares/errorHandler');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');

const NOT_FOUND = 404;

const app = express();
app.use(cookieParser());
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
  '/signup',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().min(2).max(30).required(),
        about: Joi.string().min(2).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        avatar: Joi.string().required(),
      })
      .unknown(true),
  }),
  createUser,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      })
      .unknown(true),
  }),
  login,
);

app.use(authMiddleware);

app.use('/', userRoutes);
app.use('/', cardRoutes);

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: 'Неправильный путь' });
});

app.use(errors());

app.use(handleErrors);

app.listen(port);
