const bcrypt = require("bcryptjs");
const users_db = require("../users/users-model");

module.exports = () => {
   return async (req, res, next) => {
      const {username, password} = req.headers;

      //validate request
      if (!username || !password) {
         return res.status(400).json({
            message: "Please provide a username and password."
         });
      }

      try {
         //find the user
         const user = await users_db.findBy({username}).first();

         //validate user found and password
         if (user && bcrypt.compareSync(password, user.password)) {
            next();
         } else {
            res.status(401).json({
               message: "You shall not pass!"
            });
         }
      } catch (error) {
         next(error);
      }
   };
};