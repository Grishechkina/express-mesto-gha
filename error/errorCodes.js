const VALIDATION_ERR = {
  status: 400,
  message: 'Переданы некорректные данные',
};

const CAST_ERR = {
  status: 404,
  message: 'Данные не найден или был запрошен несуществующий роут',
};

const DEFAULT_ERR = {
  status: 500,
  message: 'На сервере произошла ошибка',
};

module.exports = {
  VALIDATION_ERR,
  CAST_ERR,
  DEFAULT_ERR,
};
