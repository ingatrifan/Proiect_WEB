const jwt = require('jsonwebtoken');
//POST
const httpStatusCode= require('http-status-codes');
const PRIVATE_KEY = "SUPER_SECRET_KEY";
async function tokenVerify(req,res){
    var buffer ='';
    req.on('data',function(data){
        buffer +=data;        
        });

    req.on('end',function(){
        try{
        var post = JSON.parse(buffer);
        var token = post.serverToken;
        
        try{
            jwt.verify(token,PRIVATE_KEY);
            res.statusCode = httpStatusCode.OK;   
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({"success": true,"message": 'Success Getting Token'}));
        }
        catch(e){
            res.statusCode = httpStatusCode.UNAUTHORIZED;   
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({"success": false,"message": 'Unathorized user'}));
        }

    }
    catch(e){
        res.statusCode = httpStatusCode.UNAUTHORIZED;   
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({"success": false,"message": 'Unathorized user'}));
    }
    });
    };
module.exports={
    tokenVerify
};