const express = require("express");
const applyEndpoints = require("./endpoints");
const applyMiddlewares = require("./middlewares");

const createExpressServer = async (app) => {
  const server = express();
  applyMiddlewares(server, app);
  applyEndpoints(server, app);

  await app.db.initDB();
  await app.db.populateDB();

  server.get("/", async (req, res) => {
    res.status(200).send("App running........");
  });

  //middleware ruta no existe
  server.use((req, res, next) => {
    const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
    error.status = 404;
    next(error);
  });

  //middleware error
  server.use((error, req, res, next) => {
    console.error(`${req.method} ${req.url} ${error}`);
    const statusCode = error.status || 500;
    return res.status(statusCode).send({ error: error.message });
  });

  return server;
};

module.exports = createExpressServer;
