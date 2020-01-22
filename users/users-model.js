const db = require("../data/db-obj");
const users_db = db.bind(db, "users");
const bcrypt = require("bcryptjs");

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
      .where(filter);
};
const add = async newUser => {
   try {
      newUser.password = bcrypt.hashSync(newUser.password, 14);
   
      const [id] = await users_db().insert(newUser);
      return findById(id);
   } catch (error) {
      return Promise.reject(error);
   }
};

module.exports = {
   find,
   findById,
   findBy,
   add
}