const models = require('../models/index');
//general structure here,
//check if this shit code is right
//add details to register interaction
//add check that is in the form of 
//add and establish register rules
function register(req,res)
{
    req.on('data',function(data){

        body = JSON.parse(data);
        //check user data here
        UniqueId(body).then(
            function(data){
                console.log(data);
            if(data== true){
                var user = new models.User({
                    email : body.user_id,
                    name : body.user_name,
                    password : body.user_pass 
                });
                user.save(()=>console.log("Inserted a user"));
                //finalize
                res.writeHead(200, {
                    "Content-Type": 'text/plain'
                });
                res.write('Done');
                res.end();
            }
            else{
                res.writeHead(404, {
                    "Content-Type": 'text/plain'
                });
                res.write('Invalid Email');
                res.end();
            }
        }
        ).catch((err)=>console.log(err));
    });
}
async function UniqueId(data){
    let user;
    console.log(data);
    await models.User.findOne({email:data.user_id},function(err,doc){
        if(!err)
            user = doc;
        else
            throw err;
    });
    if(user == null)
        return true
    return false;
}


module.exports={
    register
};