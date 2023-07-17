const config = require("../../../config");
const { planetFactory } = require("../Planet");
const db = require("../db");
const {
  httpRequest,
  getGravityByString,
  getWeightOnPlanet,
  isValueValid,
} = require("../swapiFunctions");
class AbstractPeople {
  constructor(id) {
    if (this.constructor == AbstractPeople) {
      throw new Error("Abstract classes can't be instantiated.");
    }
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
      const url = `${config.swApiBaseUrl}/people/${this.id}/`;
      const peopleFormService = await httpRequest.genericRequest({
        url: this.isWookieeFormat ? `${url}?format=wookiee` : url,
        method: "GET",
        logging: true,
      });

      let homeworld = null;
      if (this.isWookieeFormat) {
        this.name = peopleFormService.whrascwo;
        this.mass = peopleFormService.acwoahrracao;
        this.height = peopleFormService.scracc;
        homeworld = peopleFormService.acooscwoohoorcanwa;
      } else {
        const { name, height, mass } = peopleFormService;
        homeworld = peopleFormService.homeworld;
        this.name = name;
        this.mass = mass;
        this.height = height;
      }

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

      if (config.saveRequest) {
        await db.swPeople.create({
          id: this.id,
          name: this.name,
          mass: +this.mass,
          height: +this.height,
          homeworld_name: this.homeworldName,
          homeworld_id: this.homeworlId,
        });
      }
    }
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getMass() {
    return this.mass;
  }

  getHeight() {
    return this.height;
  }

  getHomeworldName() {
    return this.homeworldName;
  }

  getHomeworlId() {
    return this.homeworlId;
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
    const planetGravity = planet.getGravity();
    const isGravityValid = isValueValid(planetGravity);
    const isMassValid = isValueValid(this.getMass() + "");

    const objResult = {
      person: { name: this.getName(), mass: this.getMass() },
      planet: { name: planet.getName(), gravity: planetGravity },
    };
    if (!isGravityValid && !isMassValid) {
      const result = getGravityByString(planetGravity);
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
      objResult.weighOnPlanet = WeightOnPlanet;
    }

    return objResult;
  }
}
module.exports = AbstractPeople;
