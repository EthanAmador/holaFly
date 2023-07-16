const AbstractPeople = require("./abstractPeople");
const { planetFactory } = require("../Planet");
const db = require("../db");
const {
  httpRequest,
  getGravityByString,
  getWeightOnPlanet,
} = require("../swapiFunctions");

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

  async getWeightOnPlanet(planetId) {
    const planet = await planetFactory(planetId);

    const strHomeWorldId = this.getHomeworlId();
    const homeWorldId = strHomeWorldId[strHomeWorldId.length - 1];

    if (homeWorldId == planetId) {
      throw Error(
        "It's not possible to calculate the weight of the people on its home planet. "
      );
    }
    // TODO validate if people doesn't have mass or is unknow
    const result = getGravityByString(planet.getGravity());
    const WeightOnPlanet = {};
    for (const gravity in result) {
      if (Object.hasOwnProperty.call(result, gravity)) {
        const gravityValue = result[gravity];
        WeightOnPlanet[gravity] = getWeightOnPlanet(
          this.getMass(),
          gravityValue
        );
      }
    }
    return {
      person: { name: this.getName(), mass: this.getMass() },
      planet: { name: planet.getName(), gravity: planet.getGravity() },
      weighOnPlanet: WeightOnPlanet,
    };
  }
}
module.exports = CommonPeople;
