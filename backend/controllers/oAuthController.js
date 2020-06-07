const oAuth = require('./oauth/authorize/authIndex');
const mainPage = require('../routes/mainPage');
const myURL=require('url');
const models= require('../models/index')
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = "SUPER_SECRET_KEY";
const googleUtility= require('./oauth/authorize/google/utilityFunctions');


//TO DO, PUT THE ACCESSS , REFRESH TOKENS IN DB, 
//EXCEPTIONS,  RELOADING THE PAGE, WHAT HAPPENS WITH THE CALLS

exports.dropboxAuth = async(req,res) =>{
    const findIP= require('../utils/findIp');
    let params =new URLSearchParams(myURL.parse(req.url).query);
    let svtoken = params.get('state');
    try{
        jwt.verify(svtoken,PRIVATE_KEY);
    }   
    catch(e){
        res.writeHead(404,'NO ACCESS');
        res.end();
        return;
    }
    let auth_values = jwt.decode(svtoken,PRIVATE_KEY); 
    let code = params.get('code');
    models.User.findOne({email:auth_values.user},(err,user)=>{
        if(!err){
            
            if(user.dropboxAuth.authorized!=false)
            { 
                oAuth.dropboxAuth.getAccessToken(code).then((data)=>{
                    if(data['error']){
                        //
                        console.log('error at data' );
                            //some error in here
                            
                        }else{
                    try{
                        models.User.updateOne({email:auth_values.user},{dropboxAuth:{accessToken:data.access_token,refreshToken:data.refresh_token,authorized:true,lastAccessed:new Date()}}).then(console.log('success getting token'));

                    }
                    catch(e){
                        res.writeHead(404,'Error logging In');
                        res.end();return ;   
                    }
                }
                });            
            }
    }
    });
    //let resu= await oAuth.dropboxAuth.revokeAccessToken(data.access_token);
    res.writeHead(302, {
      'Location': 'http://localhost/mainPage'
    });
    res.end();
    
}

exports.googleAuth = async (req,res) =>{
    
    let params =new URLSearchParams(myURL.parse(req.url).query);
    
    let svtoken = params.get('state');
    try{
        jwt.verify(svtoken,PRIVATE_KEY);
    }   
    catch(e){
        res.writeHead(404,'NO ACCESS');
        res.end();
        return;
    } 
    let auth_values = jwt.decode(svtoken,PRIVATE_KEY);
    let code = params.get('code');
    models.User.findOne({email:auth_values.user},(err,user)=>{
        if(!err){

            if(user.googleAuth.authorized!=false)
            { 
                
                oAuth.googleAuth.getAccessToken(code).then(async (data)=>{
                    if(data['error']){
                        //
                        
                            //some error in here
                            console.log('error at data' );
                        }else{
                    try{
                        //get the folder id  or createa folder 
                        let accessToken = data.access_token;
                        let folderId = await googleUtility.findOrCreateStolFolder(accessToken);
                        await models.User.updateOne({email:auth_values.user},{googleAuth:{folderId:folderId,accessToken:data.access_token,refreshToken:data.refresh_token,authorized:true,lastAccessed:new Date()}}).then(console.log('success getting token'));
                    }
                    catch(e){
                        console.log(e);
                        res.writeHead(404,'Error logging In');
                        
                        res.end();
                        return ;   
                    }
                }
                });            
            }
    }
    });
    res.writeHead(302, {
      'Location': 'http://localhost/mainPage'
    });
    res.end();
}

exports.oneDriveAuth = async(req,res) =>{
    let params =new URLSearchParams(myURL.parse(req.url).query);
    let svtoken = params.get('state');
    try{
        jwt.verify(svtoken,PRIVATE_KEY);
    }   
    catch(e){
        res.writeHead(404,'NO ACCESS');
        res.end();
        return;
    } 
    let auth_values = jwt.decode(svtoken,PRIVATE_KEY); 
    let code = params.get('code');
    models.User.findOne({email:auth_values.user},(err,user)=>{
        if(!err){
            if(user.oneDriveAuth.authorized!=false)
            {   
                
                oAuth.onedriveAuth.getAccessToken(code).then((data)=>{
                    if(data['error']){
                    //     
                        console.log('error at data' );
                        //some error in here
                        
                    }else{
                        try{
                            models.User.updateOne({email:auth_values.user},{oneDriveAuth:{accessToken:data.access_token,refreshToken:data.refresh_token,authorized:true,lastAccessed:new Date()}}).then(console.log('success getting token'));
                            
                        }
                        catch(e){
                            res.writeHead(404,'Error logging In');
                            res.end();return ;   
                        }

                }
                });            
            }
    }
    });
    res.writeHead(302, {
      'Location': 'http://localhost/mainPage'
    });
    res.end();
}