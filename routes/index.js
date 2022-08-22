const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { createUser, login } = require('../controllers/users');
const { hrefRegex } = require('../regex/hrefRegex');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      avatar: Joi.string().custom((href, helpers) => {
        if (hrefRegex.test(href)) {
          return href;
        }
        return helpers.message('Невалидная ссылка');
      }),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('/', () => {
  throw new NotFoundError('Данные не найден или был запрошен несуществующий роут');
});

module.exports = router;
