const express = require("express");
const helmet = require("helmet");
const server = express();
const bcrypt = require("bcryptjs");

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
   try {
      const {username, password} = req.body;
   
      if (!username || !password) {
         return res.status(400).json({
            message: "Please provide a username and password."
         });
      }
   
      const newUser = await users_db.add({username, password});
      res.status(201).json(newUser);
   } catch (error) {
      next(error);
   }
});

//POST /api/login
server.post("/api/login", async (req, res, next) => {
   const {username, password} = req.body;

   //validate request
   if (!username || !password) {
      return res.status(400).json({
         message: "Please provide a username and password."
      });
   }

   try {
      //find the user
      const user = await users_db.findBy({username}).first();
      if (!user) {
         return res.status(404).json({
            message: `No user with username: ${username} found.`
         });
      }

      //validate the password
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
         return res.status(401).json({
            message: "The username and/or password is invalid."
         });
      }

      res.json({
         message: `Welcome back ${username}!`
      });
   } catch (error) {
      next(error);
   }
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