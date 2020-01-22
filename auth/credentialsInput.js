module.exports = () => {
   return (req, res, next) => {
      console.log(`METHOD: ${req.method}`);
      console.log(`Input: ${JSON.stringify((req.method === "GET")? req.headers : req.body, null, 3)}`);
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