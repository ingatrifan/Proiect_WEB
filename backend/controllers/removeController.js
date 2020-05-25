const validation = require('../utils/checkValidation');
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = "SUPER_SECRET_KEY";
const fileIndex = require('./oauth/authorize/fileIndex');
const models = require('../models/index');
const HttpStatusCodes = require("http-status-codes");
async function remove(req,res){
    let buffer='';
    req.on('data',(data)=>{
        buffer+=data;
    })
    req.on('end',async()=>{
        console.log('removing');
        console.log(buffer);
        var data =JSON.parse(buffer);
        let serverToken = data.serverToken;
        let idFile = data.idFile;
        if(validation.checkValidation(serverToken,res)==false)
             return
            //find file db -> validate tokens ->remove file 
        var auth_values = jwt.decode(serverToken,PRIVATE_KEY);
        console.log(idFile,auth_values.user);
        await models.File.findOne({id_user:auth_values.user,id_file:idFile}, (err,file)=>{

            if(!err){
                //skip validate tokens TO DO
                let fragments= file.fragments;
                parseUpload(fragments).then(async ()=>{
                    await models.File.remove({id_user:auth_values.user,id_file:idFile}).then(()=>{
                        res.statusCode = HttpStatusCodes.OK;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({"success": true, "location":'http://localhost:3000/mainPage?serverToken='+serverToken,"message": 'Successfully upload'}));
                    });
                    
                })
                
                
            }
            else{

            }
        });

    });
}


async function parseUpload(fragments){

    for (i in fragments){
        let accesstoken = fragments[i].accessToken;
        let idFile = fragments[i].idFile;
        if(fragments[i].name=='onedrive'){
            let status =await fileIndex.onedriveFileController.remove(accesstoken,idFile);
            console.log('status',status);
        }else if(fragments[i].name=='google'){
            console.log(accesstoken,idFile);
            let status = await fileIndex.googleFileController.remove(accesstoken,idFile);
            
            
        }else if(fragments[i].name=='dropbox'){   
            let status = await fileIndex.dropboxFileController.remove(accesstoken,idFile);
            console.log(status);
        }
    }
}

module.exports={
    remove
}