const _isWookieeFormat = (req) => {
  if (req.query.format && req.query.format == "wookiee") {
    return true;
  }
  return false;
};

const applySwapiEndpoints = (server, app) => {
  const { people, planet } = app.factories;
  const { getRandomNumber } = app.swapiFunctions;

  server.get("/hfswapi/test", async (req, res) => {
    const data = await app.swapiFunctions.genericRequest(
      "https://swapi.dev/api/",
      "GET",
      null,
      true
    );
    res.send(data);
  });

  server.get("/hfswapi/getPeople/:id", async (req, res) => {
    const { id } = req.params;
    const { name, mass, height, homeworldName, homeworlId } =
      await people.peopleFactory(+id, null);

    res.send({ name, mass, height, homeworldName, homeworlId });
  });

  server.get("/hfswapi/getPlanet/:id", async (req, res) => {
    const { id } = req.params;
    const { name, gravity } = await planet.planetFactory(id);
    res.send({ name, gravity });
  });

  server.get("/hfswapi/getWeightOnPlanetRandom", async (req, res) => {
    // TODO validate ranges to get random number
    const numberRandomPeople = getRandomNumber(1, 82);
    const numberRandomPlanet = getRandomNumber(1, 60);
    const peopleResult = await people.peopleFactory(numberRandomPeople, null);
    const result = await peopleResult.getWeightOnPlanet(numberRandomPlanet);
    res.send(result);
    // res.sendStatus(501);
  });

  server.get("/hfswapi/getLogs", async (req, res) => {
    const data = await app.db.logging.findAll();
    res.send(data);
  });
};

module.exports = applySwapiEndpoints;
