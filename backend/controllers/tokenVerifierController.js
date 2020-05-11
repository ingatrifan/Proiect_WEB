const jwt = require('jsonwebtoken');
//POST
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
            res.writeHead(200, {
                'Content-Type': 'aplication/json'
            });
            let succes={'success':true};
            res.write(JSON.stringify(succes));
        }
        catch(e){
            res.writeHead(404, {
                'Content-Type': 'aplication/json'
            });    
            let succes={'success':false};
            res.write(JSON.stringify(succes));
        }

    }
    catch(e){
        res.writeHead(404, {
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