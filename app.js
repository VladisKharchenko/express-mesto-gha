const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const NOT_FOUND = 404;

const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64ac0050d50f7890d6ea4a68',
  };

  next();
});

app.use('/', userRoutes);
app.use('/', cardRoutes);

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: 'Неправильный путь' });
});

app.listen(port);
