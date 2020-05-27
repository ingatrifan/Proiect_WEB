const jwt = require('jsonwebtoken');
const models = require('../models');
const PRIVATE_KEY = "SUPER_SECRET_KEY";
const findIP= require('../utils/findIp');

async function login(req,res)
{ console.log('some shit');
    var buffer='';
    req.on('data',function(data){
        buffer +=data;        
        });
    req.on('end',function(){
        console.log(req.url);
        try{
        var post = JSON.parse(buffer);
        //decode///NEED REMAKE
        let buf = Buffer.from(post.encode,'base64');
        let decode = buf.toString('utf-8');
        let values = decode.split(':');
        let host = findIP.getIP(req.headers.host);
        
        validateUser(values).then(
            function(validation){
                console.log(validation);
                if(validation==true){
                    var token = jwt.sign({user:values[0],pass:values[1] },PRIVATE_KEY,{ expiresIn: '300h' });
                    let json = {"serverToken":token,"location":'http://'+host+'/mainPage'+'?'+'serverToken='+token};      
                    res.writeHead(200, {
                    'Content-Type': 'aplication/json'
            });

                    res.write(JSON.stringify(json));
                    res.end();
                }else{
                    res.writeHead(404, {
                        "Content-Type": 'text/plain'
                    });
                    res.write('WRONG ID/PASS');
                    res.end();
                }
                
            }
    );  
        }
        catch(e){
            res.writeHead(404, {
                "Content-Type": 'text/plain'
            });
            res.write('WRONG-PASSING-DATA');
            res.end();

        }
    });
    

}

async function validateUser(data){
    let user;
    console.log(data);
    await models.User.findOne({email:data[0]},
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