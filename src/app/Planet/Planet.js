const { httpRequest } = require("../swapiFunctions");
const db = require("../db");

class Planet {
  constructor(id) {
    this.id = +id;
  }

  async init() {
    const planetFormDb = await db.swPlanet.findByPk(this.id);
    if (planetFormDb) {
      const { name, gravity } = planetFormDb;
      this.name = name;
      this.gravity = gravity;
    } else {
      const planetFormService = await httpRequest.genericRequest({
        url: `https://swapi.dev/api/planets/${this.id}`,
        method: "GET",
        logging: true,
      });
      const { name, gravity } = planetFormService;
      this.name = name;
      this.gravity = gravity;
    }
  }

  getName() {
    return this.name;
  }

  getGravity() {
    return this.gravity;
  }
}
module.exports = Planet;
