const db = require("./db");
const swapiFunctions = require("./swapiFunctions");
const people = require("./People");
const planet = require("./Planet");

const factories = {
  people,
  planet,
};

module.exports = {
  db,
  swapiFunctions,
  factories,
};
