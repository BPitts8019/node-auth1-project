const bcrypt = require("bcryptjs");
const users_db = require("../users/users-model");

module.exports = () => {
   return async (req, res, next) => {
      //userame and password expected in req.credentials
      const {username, password} = req.credentials;

      try {
         //find the user
         const user = await users_db.findBy({username}).first();

         //validate user found and password
         if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({
               message: "You shall not pass!"
            });
         }
      } catch (error) {
         next(error);
      }

      next();
   };
};