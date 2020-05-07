const qs = require('querystring');
const models = require('../models');
async function login(req,res)
{   var buffer='';
    req.on('data',function(data){
        buffer +=data;        
        });
    req.on('end',function(){
        
        var post = JSON.parse(buffer);
        console.log(post);
        
        validateUser(post).then(
            function(validation){
                if(validation==true){
                    res.writeHead(200, {
                        "Content-Type": 'text/plain'
                    });
                    res.write('Done');                  
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
    
     if(user.email==data.user_id && user.password == data.user_pass){
        return true;
     }
     return false;
}

module.exports={
    login
};