const refragmentation = require('../utils/refregmentation');
const fileIndex = require('./oauth/authorize/fileIndex');
const validation = require('../utils/checkValidation');
const models = require('../models/index');
const fs =require('fs');
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = "SUPER_SECRET_KEY";
const url = require('url');
const path =require('path');
const fragmentation= require('../utils/fragmentation');
const HttpStatusCodes = require('http-status-codes');
const utilities = require('./oauth/authorize/utilityIndex');

async function donwload(req,res){
    let uri = url.parse(req.url).query;
    let values = uri.split('&');
    let token = values[0].split('=')[1];
    let idFile = values[1].split('=')[1];
    if(validation.checkValidation(token,res)==false)
        return  
    let auth_values =jwt.decode(token,PRIVATE_KEY);

    let tmpPath= path.join(process.cwd(),'tmp',auth_values.user);
    try{
        await fs.mkdirSync(tmpPath);    
    }
    catch(e){}
    
    await models.File.findOne({id_user:auth_values.user,id_file:idFile},async (err,file)=>{
        if(file==null){

            res.statusCode = HttpStatusCodes.BAD_REQUEST;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({"success": false,"message": 'FileId not found or userId'}));
            return ;
        }
        file =await  utilities.tokenRefresher.refreshTokens(file);
        
        let fragments = file.fragments;
        let filesStatus = await utilities.validateFiles.validateFiles(file,utilities);
        if(filesStatus==false){
            res.statusCode = HttpStatusCodes.NOT_FOUND;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({"success": false,"message": 'File deleted from drive '}));
            return;
        }
        parseDownload(fragments,auth_values.user).then(fragments=>{
            refragmentation.refragmentation(fragments,auth_values.user,file.fileName).then(fileOut=>{
                let stream  = fs.createReadStream(fileOut);
                res.statusCode = HttpStatusCodes.OK;
                stream.pipe(res);
                stream.on('close',()=>{ 
                    let cleanPath =  path.join(process.cwd(),'tmp',auth_values.user);
                    fragmentation.deleteFolderRecursive(cleanPath);
                })
            }).catch(e=>{
                res.statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({"success": false,"message": 'File corrupted or modifier, deleting it'}));
            })
        });
    }).catch((e)=>{
        res.statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({"success": false,"message": 'Erorr in download'}));
    })
}



async function parseDownload(fragments,id_user){ 
    let fragmentData=[];
    return new Promise(async (resolve,reject)=>{
    for(let  i=0;i<fragments.length;i++){
        if(fragments[i].name=='onedrive'){
            let fragment = await fileIndex.onedriveFileController.download(fragments[i],id_user);
            if(fragment==false)
                reject(false);
            
            fragmentData.push(fragment);
        }else if(fragments[i].name=='google'){ 
            let fragment = await fileIndex.googleFileController.download(fragments[i],id_user);
            if(fragment==false)
                reject(false)
            
            fragmentData.push(fragment);

        }else if(fragments[i].name=='dropbox'){
            let fragment= await fileIndex.dropboxFileController.download(fragments[i],id_user);
            if(fragment==false)
                reject(false);
            fragmentData.push(fragment);
        }
    }
    resolve(fragmentData);
});
}

module.exports={
    donwload
}