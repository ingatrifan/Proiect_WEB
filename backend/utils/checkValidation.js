const jwt = require('jsonwebtoken');
const HttpStatusCodes = require("http-status-codes")
const PRIVATE_KEY = "SUPER_SECRET_KEY";

function checkValidation(token,res){
    try{
        jwt.verify(token,PRIVATE_KEY);
      }
      catch(e){
        res.statusCode = HttpStatusCodes.BAD_REQUEST;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({"success": false,"message": 'No valid Token'}));
         return false;
      }
      return true;
}
module.exports={
    checkValidation
}