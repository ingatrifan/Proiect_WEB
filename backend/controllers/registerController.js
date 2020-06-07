const models = require('../models/index');
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
        //check user data here
        UniqueId(post).then(
            async function(validate){
                var body = post;
            if(validate== true){
                var user = new models.User({
                    email : body.user_id,
                    name : body.user_name,
                    password :await bcrypt.hash( body.user_pass ,saltRounds).then(hash=>{return new Promise(resolve=>{resolve(hash)})})
                });
                user.save(()=>console.log("Inserted a user"));
                res.statusCode = httpSttatusCode.BAD_REQUEST;   
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({"success": false,"message": 'Successfull Register'}));
            }
            else{
                res.statusCode = httpSttatusCode.BAD_REQUEST;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({"success": false,"message": 'Invalid Email'}));
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
         models.User.findOne({email:data.user_id},function(err,doc){
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