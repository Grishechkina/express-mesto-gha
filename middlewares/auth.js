const jwt = require('jsonwebtoken');
const BadAuthError = require('../errors/bad-auth-err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'dont-steal-this-key');
  } catch (err) {
    throw new BadAuthError('Необходима авторизация.');
  }

  req.user = payload;

  return next();
};
