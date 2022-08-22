const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const AccessError = require('../errors/access-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const id = req.user._id;

  Card.create({ name, link, owner: id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Невалидные данные'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }

      if (card.owner.toString() !== req.user._id) {
        throw new AccessError('Нет прав для удаления карточки');
      }

      return Card.findByIdAndRemove(cardId)
        .then(() => {
          if (!card) {
            throw new NotFoundError('Нет карточки с таким id');
          }
          res.send(card);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидные данные'));
        return;
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  const id = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидные данные'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCardLike = (req, res, next) => {
  const id = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидные данные'));
        return;
      }
      next(err);
    });
};
