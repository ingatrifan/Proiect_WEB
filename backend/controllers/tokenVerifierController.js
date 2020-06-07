const jwt = require('jsonwebtoken');
//POST
const httpStatusCode= require('http-status-codes');
const PRIVATE_KEY = "SUPER_SECRET_KEY";
async function tokenVerify(req,res){
    console.log('sdfsdf');
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
            res.writeHead(httpStatusCode.OK, {
                'Content-Type': 'aplication/json'
            });
            let succes={'success':true};
            res.write(JSON.stringify(succes));
        }
        catch(e){
            res.writeHead(httpStatusCode.UNAUTHORIZED, {
                'Content-Type': 'aplication/json'
            });    
            let succes={'success':false};
            res.write(JSON.stringify(succes));
        }

    }
    catch(e){
        res.writeHead(httpStatusCode.UNAUTHORIZED, {
            'Content-Type': 'aplication/json'
        });    
        let succes={'success':false};
        res.write(JSON.stringify(succes));
    }
        res.end();
    });
    };
module.exports={
    tokenVerify
};