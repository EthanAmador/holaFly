const loggingMiddleware = (db) => async (req, res, next) => {
  const action = `${req.method}-${req.path}`;
  const header = JSON.stringify(req.headers);
  const ip = req.ip;

  await db.logging.create({ action, header, ip });

  next();
};

module.exports = loggingMiddleware;
