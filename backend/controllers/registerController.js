const models = require('../models/index');
const mailSender = require('../utils/mailSender')
const jwt = require('jsonwebtoken');
const CONFIRM_SECRET = 'Our project is the best, ahahaha';
const httpSttatusCode =require('http-status-codes');
const bcrypt = require('bcrypt');
const saltRounds = 10;
function register(req,res)
{
    var buffer ='';
    req.on('data',function(data){
        buffer+=data;
    });
    req.on('end',function(){
        try{
        var post  = JSON.parse(buffer);
        UniqueId(post).then(
            async function(validate){
                var body = post;
            if(validate== true){
                var user = new models.User({
                    email : body.email,
                    name : body.name,
                    password :await bcrypt.hash( body.password ,saltRounds).then(hash=>{return new Promise(resolve=>{resolve(hash)})})
                });
                user.save(()=>console.log("Inserted a user"));
                const token = jwt.sign({email:body.email},CONFIRM_SECRET,{ expiresIn: '7d'});
                mailSender.sendMail('hello',user,token);
                res.statusCode = httpSttatusCode.CREATED;   
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({"success": true,"message": 'Successfull Register'}));
            }
            else{
                res.statusCode = httpSttatusCode.CONFLICT;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({"success": false,"message": 'There already exists an user with this email'}));
            }
        }
        );
    }
    catch(e){
        res.statusCode = httpSttatusCode.BAD_REQUEST;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({"success": false,"message": 'Invalid Json'}));
    }
    });
}
async function UniqueId(data){
    return new Promise((resolve,reject)=>{
         models.User.findOne({email:data.email},function(err,doc){
            if(!err)
            {
                if(doc == null)
                    resolve(true);
                 else 
                resolve(false)
                 }
            else
                reject(err);
        });
    });
}

module.exports={
    register
};