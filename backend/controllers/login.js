const models = require('../models');
async function login(req,res)
{
    req.on('data',function(data){

        body = JSON.parse(data);
        validateUser(body).then(
            function(data){
                console.log(data);
                if(data==true){
                    res.writeHead(200, {
                        "Content-Type": 'text/plain'
                    });
                    res.write('USER LOGGED IN');
                    res.end();
                }
                else{
                    res.writeHead(404, {
                        "Content-Type": 'text/plain'
                    });
                    res.write('Invalid ID/PASS');
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