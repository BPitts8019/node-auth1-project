const express = require("express");
const server = express();

//middleware
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const credentialsInput = require("./auth/credentialsInput");
const restricted = require("./auth/restricted");


//data models
const users_db = require("./users/users-model");

//apply middleware
server.use(helmet());
server.use(express.json());

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
server.post("/api/login", credentialsInput(), restricted(), async (req, res, next) => {
   //credentials checked in restricted middleware
   res.json({
      message: `Welcome back ${req.credentials.username}!`
   });
});

//GET /api/users
server.get("/api/users", restricted(), async (req, res, next) => {
   //credentials checked in restricted middleware
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
