const express = require("express");
const helmet = require("helmet");
const server = express();

//routers
const usersRouter = require("./users/users-router");

//middleware
server.use(helmet());
server.use(express.json());

//endpoints
server.get("/", (req, res, next) => {
   res.json({message: "Welcome to Node Auth01 API!"});
});

server.use("/api/users", usersRouter);

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