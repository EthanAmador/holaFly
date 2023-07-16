const db = require("./db");
const swapiFunctions = require("./swapiFunctions");
const people = require("./People");

const factories = {
  people,
};

module.exports = {
  db,
  swapiFunctions,
  factories,
};
