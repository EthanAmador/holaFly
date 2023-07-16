const AbstractPeople = require("./abstractPeople");
const { planetFactory } = require("../Planet");
const db = require("../db");
const { httpRequest } = require("../swapiFunctions");

class CommonPeople extends AbstractPeople {
  constructor(id) {
    super(id);
    this.id = +id;
  }

  async init() {
    const peopleFromDb = await db.swPeople.findByPk(this.id);

    if (peopleFromDb) {
      this.name = peopleFromDb.name;
      this.mass = peopleFromDb.mass;
      this.height = peopleFromDb.height;
      this.homeworldName = peopleFromDb.homeworld_name;
      this.homeworlId = peopleFromDb.homeworld_id;
    } else {
      const peopleFormService = await httpRequest.genericRequest({
        url: `https://swapi.dev/api/people/${this.id}/`,
        method: "GET",
        logging: true,
      });
      const { name, height, mass } = peopleFormService;
      let { homeworld } = peopleFormService;
      this.name = name;
      this.mass = mass;
      this.height = height;

      const isSlash = homeworld[homeworld.length - 1] === "/";
      if (isSlash) {
        //remove the last slash from the string
        homeworld = homeworld.substring(0, homeworld.length - 1);
      }
      const planetId = homeworld[homeworld.length - 1];
      const planet = await planetFactory(planetId);
      const planetName = planet.getName();
      this.homeworldName = planetName;
      this.homeworlId = `/planets/${planetId}`;
    }
  }

  getWeightOnPlanet(planetId) {
    throw new Error("To be implemented");
  }
}
module.exports = CommonPeople;
