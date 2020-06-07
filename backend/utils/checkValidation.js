const jwt = require('jsonwebtoken');
const HttpStatusCodes = require("http-status-codes")
const PRIVATE_KEY = "SUPER_SECRET_KEY";

function checkValidation(token,res){
    try{
        jwt.verify(token,PRIVATE_KEY);
      }
      catch(e){
         res.writeHead(HttpStatusCodes.MOVED_TEMPORARILY, {
            'Location': 'http://localhost/mainPage'
          });
          res.end();
         return false;
      }
      return true;
}
module.exports={
    checkValidation
}