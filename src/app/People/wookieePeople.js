const AbstractPeople = require("./abstractPeople");

class WookieePeople extends AbstractPeople {
  constructor(id) {
    super(id);
    this.id = id;
    this.isWookieeFormat = true;
  }
}

module.exports = WookieePeople;
