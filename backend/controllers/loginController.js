const jwt = require('jsonwebtoken');
const path = require('path');
const url = require('url');
const fs = require('fs');
const models = require('../models');
const PRIVATE_KEY = "SUPER_SECRET_KEY";
async function login(req,res)
{ 
    
    
    
    
        
    var buffer='';
    req.on('data',function(data){
        buffer +=data;        
        });
    req.on('end',function(){

        var post = JSON.parse(buffer);
    
        //decode
        let buf = Buffer.from(post.encode,'base64');
        let decode = buf.toString('utf-8');
        let values = decode.split(':');
        
        var token = jwt.sign({user:values[0],pass:values[1] },PRIVATE_KEY,{ expiresIn: '300h' });
                    let json = {"serverToken":token,"location":"http://127.0.0.1:3000/mainPage.html"};
                    res.writeHead(200, {
                    'Content-Type': 'aplication/json'
                });
        var decoded = jwt.decode(token);    
            console.log(decoded);
                    res.write(JSON.stringify(json));
                    res.end();
                    /*
        validateUser(values).then(
            function(validation){
                var filename = path.join(process.cwd(),'views/pages','mainPage.html');
                    
                if(validation==true){
                    
                }else{
                    res.writeHead(404, {
                        "Content-Type": 'text/plain'
                    });
                    res.write('WRONG ID/PASS');
                    res.end();
                }
            }
    );  */
    });
    

}

async function validateUser(data){
    let user;
    await models.User.findOne({email:data.user_id},
        function(err,doc){
            if(!err)
                user = doc;
     });
     if(user==null)
        return false;
    
     if(user.email==data[0] && user.password == data[1]){
        return true;
     }
     return false;
}

module.exports={
    login
};