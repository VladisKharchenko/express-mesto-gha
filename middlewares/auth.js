const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError('Отсутствует токен авторизации'));
  }

  try {
    const payload = await jwt.verify(token, 'some-secret-key');
    req.user = payload;
  } catch (error) {
    return next(new UnauthorizedError('Неверный токен авторизации'));
  }

  return next();
};

module.exports = authMiddleware;
