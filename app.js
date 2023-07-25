const express = require('express');
const mongoose = require('mongoose');
const handleErrors = require('./middlewares/errorHandler');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');

const NOT_FOUND = 404;

const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', createUser);
app.post('/signin', login);

app.use(authMiddleware);

app.use('/', userRoutes);
app.use('/', cardRoutes);

app.use(handleErrors);

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: 'Неправильный путь' });
});

app.listen(port);
