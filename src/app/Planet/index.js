const Planet = require("./Planet");

const planetFactory = async (id) => {
  const planet = new Planet(id);
  await planet.init();
  return planet;
};

module.exports = { planetFactory };
