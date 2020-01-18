module.exports = () => {
   return (req, res, next) => {
      const {username, password} = (req.method === "GET")? req.headers : req.body;
   
      if (!username || !password) {
         return res.status(400).json({
            message: "Please provide a username and password."
         });
      }

      req.credentials = {username, password};
      next();
   };
}