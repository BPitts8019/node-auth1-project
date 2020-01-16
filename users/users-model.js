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
const findBy = () => {};
const add = async newUser => {
   try {
      const [id] = await users_db().insert(newUser);
      return findById(id);
   }  catch (error) {
      return Promise.reject(error);
   }
};

module.exports = {
   find,
   findById,
   findBy,
   add
}