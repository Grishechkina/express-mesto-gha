const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { hrefRegex } = require('../regex/hrefRegex');
const {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserById);
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).required(),
    }),
  }),
  getUserById,
);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUserProfile,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom((href, helpers) => {
        if (hrefRegex.test(href)) {
          return href;
        }
        return helpers.message('Невалидная ссылка');
      }),
    }),
  }),
  updateUserAvatar,
);

module.exports = router;
