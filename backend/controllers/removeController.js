const validation = require('../utils/checkValidation');
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = "SUPER_SECRET_KEY";
const fileIndex = require('./oauth/authorize/fileIndex');
const models = require('../models/index');
const HttpStatusCodes = require("http-status-codes");
const findIP= require('../utils/findIp');
const utilities = require('./oauth/authorize/utilityIndex');

async function remove(req,res){
    let host = findIP.getIP(req.headers.host);
    let buffer='';
    req.on('data',(data)=>{
        buffer+=data;
    })
    req.on('end',async()=>{
        var data =JSON.parse(buffer);
        let serverToken = data.serverToken;
        let idFile = data.idFile;
        if(validation.checkValidation(serverToken,res)==false)
             return
            //find file db -> validate tokens ->remove file 
        var auth_values = jwt.decode(serverToken,PRIVATE_KEY);
        await models.File.findOne({id_user:auth_values.user,id_file:idFile},async (err,file)=>{
            if(!err){
                let files = await models.File.find({folder:data.idFile})
                //skip validate tokens TO DO
                if (files.length>0){
                    res.statusCode = HttpStatusCodes.UNAUTHORIZED;
                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify({"success": true,"message": 'You cannot remove this folder, first delete files'}));
                }
                if (!file.id_file){
                    await models.File.findByIdAndRemove({_id:data.idFile});
                    res.statusCode = HttpStatusCodes.OK;
                    res.setHeader('Content-Type', 'application/json');
                    return res.end(JSON.stringify({"success": true,"message": 'Successfully deleted'}));
                }
                file = await utilities.tokenRefresher.refreshTokens(file);
                let fragments= file.fragments;
                parseUpload(fragments).then(async ()=>{
                    await models.File.remove({id_user:auth_values.user,id_file:idFile}).then(()=>{
                        res.statusCode = HttpStatusCodes.OK;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({"success": true,"message": 'Successfully deleted'}));
                    });
                    
                })
            }
            else{
                res.statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({"success": true, "message": 'Error in removing file'}));
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