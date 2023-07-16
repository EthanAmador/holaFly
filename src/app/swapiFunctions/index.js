const httpRequest = require("./httpRequest");

const getWeightOnPlanet = (mass, gravity) => {
  return mass * gravity;
};

const getFloatValueFromString = (str) => {
  const regex = /(\d+(\.\d+)?)/;
  const regexMatch = str.match(regex);
  if (regexMatch && regexMatch[0]) {
    return parseFloat(regexMatch[0]);
  }
  throw Error(`Invalid gravity`);
};

const getStringValue = (str) => {
  const regex = /[a-zA-Z()]+/g;
  const regexMatch = str.match(regex);
  if (regexMatch && regexMatch.length > 0) {
    const letters = regexMatch.join("");
    return letters;
  }
  return "default";
};

const getGravityByString = (str) => {
  const planetGravity = str.split(",");
  const result = {};
  for (const gravityStr of planetGravity) {
    const floatValue = getFloatValueFromString(gravityStr);
    const stringValue = getStringValue(gravityStr);
    result[stringValue] = floatValue;
  }
  return result;
};

const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const isValueValid = (value) =>
  ["unknown", "N/A"].some((word) => value.includes(word));

module.exports = {
  getWeightOnPlanet,
  httpRequest,
  getGravityByString,
  getRandomNumber,
  isValueValid,
};
