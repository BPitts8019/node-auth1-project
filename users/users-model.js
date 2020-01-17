const db = require("../data/db-obj");
const users_db = db.bind(db, "users");

const find = () => {
   return users_db();
};
const findById = id => {
   return users_db()
      .where({id})
      .first();
};
const findBy = (filter) => {
   return users_db()
      .where(filter)
      .first();
};

module.exports = {
   find,
   findById,
   findBy
}