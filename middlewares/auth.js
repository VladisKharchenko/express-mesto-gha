const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Отсутствует токен авторизации' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = await jwt.verify(token, 'some-secret-key');
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Неверный токен авторизации' });
  }
};

module.exports = authMiddleware;
