const User = require('../models/user');
const { VALIDATION_ERR, NOT_FOUND_ERR, DEFAULT_ERR } = require('../error/errorCodes');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(DEFAULT_ERR.status).send({ message: DEFAULT_ERR.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERR.status).send({ message: NOT_FOUND_ERR.message });
      } else {
        res.send(user);
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

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201);
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERR.status).send({ message: VALIDATION_ERR.message });
        return;
      }
      res.status(DEFAULT_ERR.status).send({ message: DEFAULT_ERR.message });
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERR.status).send({ message: NOT_FOUND_ERR.message });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(VALIDATION_ERR.status).send({ message: VALIDATION_ERR.message });
        return;
      }
      res.status(DEFAULT_ERR.status).send({ message: DEFAULT_ERR.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERR.status).send({ message: NOT_FOUND_ERR.message });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(VALIDATION_ERR.status).send({ message: VALIDATION_ERR.message });
        return;
      }
      res.status(DEFAULT_ERR.status).send({ message: DEFAULT_ERR.message });
    });
};
