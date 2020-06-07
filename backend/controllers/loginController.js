//bcrypt
const jwt = require('jsonwebtoken');
const models = require('../models');
const PRIVATE_KEY = "SUPER_SECRET_KEY";
const findIP= require('../utils/findIp');
const bcrypt = require('bcrypt');
const httpSttatusCode = require('http-status-codes');

async function login(req,res)
{
    var buffer='';
    req.on('data',function(data){
        buffer +=data;        
        });
    req.on('end',function(){
        try{
        var post = JSON.parse(buffer);
        let buf = Buffer.from(post.encode,'base64');
        let decode = buf.toString('utf-8');
        let values = decode.split(':');
        let host = findIP.getIP(req.headers.host);
        validateUser(values).then(
            function(validation){
                if(validation==true){
                    var token = jwt.sign({user:values[0] },PRIVATE_KEY,{ expiresIn: '300h' });
                    let json = {
                        "serverToken":token,
                        "location":'http://'+host+'/mainPage'+'?'+'serverToken='+token
                    };      
                    res.statusCode = httpSttatusCode.OK;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(json));
                }else{
                    res.statusCode = httpSttatusCode.FORBIDDEN;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({"success": false,"message": 'Wrong email or passsword, or account is not confirmed'}));
                }
            }).catch(e=>{throw e;});  
        }
        catch(e){
            res.statusCode = httpSttatusCode.INTERNAL_SERVER_ERROR;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({"success": false,"message": 'Error in login'}));
        }
    });
    

}
async function validateUser(data){
    return new Promise((resolve,reject)=>{
        models.User.findOne({email:data[0]},
            async function(err,doc){
                if(!err)
                {
                    console.log(doc);
                    if(doc==null || !doc.confirmed)
                        resolve(false);
                    else{
                        const match =await bcrypt.compare(data[1],doc.password)  ;
                        if(match)
                            resolve(true);
                        else 
                        resolve(false);
                    }
                }
                else
                    reject(err);
        });

    });
}

module.exports={
    login
};