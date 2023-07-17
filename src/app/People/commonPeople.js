const AbstractPeople = require("./abstractPeople");

class CommonPeople extends AbstractPeople {
  constructor(id) {
    super(id);
    this.id = +id;
    this.isWookieeFormat = false;
  }
}
module.exports = CommonPeople;
