const express = require("express");
const server = express();

//middleware
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const credentialsInput = require("./auth/credentialsInput");
const restricted = require("./auth/restricted");

//data models
const users_db = require("./users/users-model");

//apply middleware
server.use(helmet());
server.use(express.json());
server.use(session({
   resave: false,
   saveUninitialized: false,
   secret: process.env.SECRET_PHRASE,
   cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 30,//expires after 30min
      secure: false
   },
}));

//Welcome
server.get("/", (req, res, next) => {
   res.json({message: "Welcome to node-auth1-project API!"});
});

//POST /api/register
server.post("/api/register", credentialsInput(), async (req, res, next) => {
   try {
      const newUser = await users_db.add(req.credentials);
      res.status(201).json(stripPasswords(newUser));
   } catch (error) {
      next(error);
   }
});

//POST /api/login
server.post("/api/login", credentialsInput(),  async (req, res, next) => {
   //credentials checked in restricted middleware
   //userame and password expected in req.credentials
   const {username, password} = req.credentials;

   try {
      //find the user
      const user = await users_db.findBy({username}).first();

      //validate user found and password
      if (!user || !bcrypt.compareSync(password, user.password)) {
         return res.status(403).json({
            message: "You shall not pass!"
         });
      }

      //Authenticated! Save user data in current session
      console.log("Authenticated!");
      req.session.user = user;
      res.json({
         message: `Welcome back ${user.username}!`
      });
   } catch (error) {
      next(error);
   }
});

//GET /api/users
server.get("/api/users", async (req, res, next) => {
   //check for loggedin user
   if (!req.session || !req.session.user) {
      return res.status(403).json({
         message: "You shall not pass!"
      });
   }

   console.log("Authenticated! Getting users list");
   try {
      let users = await users_db.find();
      res.json(users.map(stripPasswords));
   } catch (error) {
      next(error);
   }
});

//404 Not Found
server.use((req, res, next) => {
   res.status(404).json({
      message: "Page not found"
   });
});

//500 Server Errors
server.use((error, req, res, next) => {
   res.status(500).json({
      data: error.toString()
   });
});

module.exports = server;

function stripPasswords (user) {
   return {
      id: user.id,
      username: user.username
   }
}
