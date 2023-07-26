const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Отсутствует токен авторизации'));
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = await jwt.verify(token, 'some-secret-key');
    req.user = payload;
  } catch (error) {
    return next(new UnauthorizedError('Неверный токен авторизации'));
  }
  return next();
};

module.exports = authMiddleware;
