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
const findBy = filter => {
   return users_db()
      .where(filter)
      .first();
};
const add = async newUser => {
   const [id] = await users_db().insert(newUser);
   return findById(id);
};

module.exports = {
   find,
   findById,
   findBy,
   add
}