const WookieePeople = require("./wookieePeople");
const CommonPeople = require("./commonPeople");

const peopleFactory = async (id, isWookieeLanguaje) => {
  const people = isWookieeLanguaje
    ? new WookieePeople(id)
    : new CommonPeople(id);
  await people.init();
  return people;
};

module.exports = { peopleFactory };
