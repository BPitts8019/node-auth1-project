const express = require("express");
const helmet = require("helmet");
const server = express();

//data models
const users_db = require("./users/users-model");

//middleware
server.use(helmet());
server.use(express.json());

//Welcome
server.get("/", (req, res, next) => {
   res.json({message: "Welcome to node-auth1-project API!"});
});

//POST /api/register
server.post("/api/register", async (req, res, next) => {
   const {username, password} = req.body;

   if (!username || !password) {
      return res.status(400).json({
         message: "Please provide a username and password."
      });
   }

   const newUser = await users_db.add({username, password});
   res.status(201).json(newUser);
});

//POST /api/login
server.post("/api/login", async () => {

});

//GET /api/users
server.get("/api/users", async (req, res, next) => {
   try {
      const users = await users_db.find();
      res.json(users);
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