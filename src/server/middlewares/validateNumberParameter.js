const isNumber = (value) => /^\d+$/.test(value);

const validateNumberParams = (req, res, next) => {
  const { id } = req.params;
  if (!isNumber(id)) {
    const error = new Error("Los parámetros deben ser solo números");
    error.status = 400;
    return next(error);
  }
  next();
};

module.exports = validateNumberParams;
