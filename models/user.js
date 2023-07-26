const mongoose = require('mongoose');
const validator = require('validator');

function emailValidator(value) {
  return validator.isEmail(value);
}

const avatarRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}([-a-zA-Z0-9()_+~%#?&//=]*)$/;

const defaultName = 'Жак-Ив Кусто';
const defaultAbout = 'Исследователь';
const defaultAvatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: defaultName,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: defaultAbout,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: defaultAvatar,
    validate: {
      validator: (value) => avatarRegex.test(value),
      message: 'Неверный формат ссылки на аватар',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: emailValidator,
      message: 'Неверный формат электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
