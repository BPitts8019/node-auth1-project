const router = require("express").Router();
const usersDB = require("./users-model");

router.get("/", async (req, res, next) => {
   try {
      const users = await usersDB.find();
      res.json(users);
   } catch (error) {
      next(error);
   }
});

router.post("/", async (req, res, next) => {
   try {
      const {username, password} = req.body;
      const user = await usersDB.add({username, password});
      res.status(201).json(user);
   } catch (error) {
      next(error);
   }
});

router.get("/:id", async (req, res, next) => {
   const user = await usersDB.findById(id);
   res.json(user);
});



module.exports = router;