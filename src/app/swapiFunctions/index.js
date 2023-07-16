const httpRequest = require("./httpRequest");

const getWeightOnPlanet = (mass, gravity) => {
  return mass * gravity;
};

module.exports = {
  getWeightOnPlanet,
  httpRequest,
};
