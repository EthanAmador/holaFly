const applySwapiEndpoints = (server, app) => {
  const { people, planet } = app.factories;
  const { getRandomNumber, isWookieeFormat } = app.swapiFunctions;
  const { validateNumberParam } = app.customMiddleWares;

  server.get("/hfswapi/test", async (req, res) => {
    try {
      const data = await app.swapiFunctions.genericRequest(
        "https://swapi.dev/api/",
        "GET",
        null,
        true
      );
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  });

  server.get(
    "/hfswapi/getPeople/:id",
    validateNumberParam,
    async (req, res, next) => {
      const { id } = req.params;
      try {
        const isWookiee = isWookieeFormat(req);

        const { name, mass, height, homeworldName, homeworlId } =
          await people.peopleFactory(+id, isWookiee);

        res.status(200).send({ name, mass, height, homeworldName, homeworlId });
      } catch (error) {
        next(error);
      }
    }
  );

  server.get(
    "/hfswapi/getPlanet/:id",
    validateNumberParam,
    async (req, res, next) => {
      const { id } = req.params;
      try {
        const { name, gravity } = await planet.planetFactory(id);
        res.status(200).send({ name, gravity });
      } catch (error) {
        next(error);
      }
    }
  );

  server.get("/hfswapi/getWeightOnPlanetRandom", async (req, res, next) => {
    let { peopleId, planetId } = req.query;
    try {
      peopleId = peopleId ?? getRandomNumber(1, 82);
      planetId = planetId ?? getRandomNumber(1, 60);
      const isWookiee = isWookieeFormat(req);

      const peopleResult = await people.peopleFactory(peopleId, isWookiee);
      const result = await peopleResult.getWeightOnPlanet(planetId);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  });

  server.get("/hfswapi/getLogs", async (req, res, next) => {
    try {
      const data = await app.db.logging.findAll({ order: [["id", "DESC"]] });
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  });
};

module.exports = applySwapiEndpoints;
