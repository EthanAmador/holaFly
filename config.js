require("dotenv").config();

const { SWAPI_BASE_URL, PORT, NODE_ENV, SAVE_REQUEST } = process.env;

module.exports = {
  swApiBaseUrl: SWAPI_BASE_URL,
  port: +PORT,
  nodeEnv: NODE_ENV,
  saveRequest: SAVE_REQUEST === "true",
};
