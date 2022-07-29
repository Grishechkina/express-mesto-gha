const User = require('../models/user');
const { VALIDATION_ERR, CAST_ERR, DEFAULT_ERR } = require('../error/errorCodes');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send([users]))
    .catch(() => res.status(DEFAULT_ERR.status).send({ message: DEFAULT_ERR.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(CAST_ERR.status).send({ message: CAST_ERR.message });
        return;
      }
      res.status(DEFAULT_ERR.status).send({ message: DEFAULT_ERR.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
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

  if (!name || !about) {
    res.status(VALIDATION_ERR.status).send({ message: VALIDATION_ERR.message });
    return;
  }

  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(CAST_ERR.status).send({ message: CAST_ERR.message });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERR.status).send({ message: VALIDATION_ERR.message });
        return;
      }
      res.status(DEFAULT_ERR.status).send({ message: DEFAULT_ERR.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;

  if (!avatar) {
    res.status(VALIDATION_ERR.status).send({ message: VALIDATION_ERR.message });
    return;
  }

  User.findByIdAndUpdate(id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(CAST_ERR.status).send({ message: CAST_ERR.message });
        return;
      }
      res.status(DEFAULT_ERR.status).send({ message: DEFAULT_ERR.message });
    });
};
