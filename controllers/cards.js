const Card = require('../models/card');
const { VALIDATION_ERR, NOT_FOUND_ERR, DEFAULT_ERR } = require('../error/errorCodes');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send([cards]))
    .catch(() => res.status(DEFAULT_ERR.status).send({ message: DEFAULT_ERR.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const id = req.user._id;

  if (!name || !link) {
    res.status(VALIDATION_ERR.status).send({ message: VALIDATION_ERR.message });
    return;
  }

  Card.create({ name, link, owner: id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERR.status).send({ message: VALIDATION_ERR.message });
        return;
      }
      res.status(DEFAULT_ERR.status).send({ message: DEFAULT_ERR.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERR.status).send({ message: NOT_FOUND_ERR.message });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERR.status).send({ message: VALIDATION_ERR.message });
        return;
      }
      res.status(DEFAULT_ERR.status).send({ message: DEFAULT_ERR.message });
    });
};

module.exports.likeCard = (req, res) => {
  const id = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERR.status).send({ message: NOT_FOUND_ERR.message });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERR.status).send({ message: VALIDATION_ERR.message });
        return;
      }
      res.status(DEFAULT_ERR.status).send({ message: DEFAULT_ERR.message });
    });
};

module.exports.deleteCardLike = (req, res) => {
  const id = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERR.status).send({ message: NOT_FOUND_ERR.message });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERR.status).send({ message: VALIDATION_ERR.message });
        return;
      }
      res.status(DEFAULT_ERR.status).send({ message: DEFAULT_ERR.message });
    });
};
