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
    //TO DO : validez accesstoken-urile 
    //TO DO : validez file-urirle
    //fetch the file info from db -> check tokens(TO DO  )->validate files(TO DO)  ->fetch data
    //NOT COMPLETE
    let tmpPath= path.join(process.cwd(),'tmp',auth_values.user);
    try{
        await fs.mkdirSync(tmpPath);    
    }
    catch(e){}
    
    await models.File.findOne({id_user:auth_values.user,id_file:idFile},async (err,file)=>{
        
        file =await  utilities.tokenRefresher.refreshTokens(file);
        let fragments = file.fragments;
        parseDownload(fragments,auth_values.user).then(fragments=>{
            refragmentation.refragmentation(fragments,auth_values.user,file.fileName).then(fileOut=>{
                let stream  = fs.createReadStream(fileOut);
                stream.pipe(res);
                stream.on('close',()=>{ 
                    let cleanPath =  path.join(process.cwd(),'tmp',auth_values.user);
                    fragmentation.deleteFolderRecursive(cleanPath);
                    console.log('Finished downloading, now cleaning ');
                })
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
    return new Promise(async (resolve)=>{
    for(let  i=0;i<fragments.length;i++){
        if(fragments[i].name=='onedrive'){
            let fragment = await fileIndex.onedriveFileController.download(fragments[i],id_user);
            fragmentData.push(fragment);
        }else if(fragments[i].name=='google'){ 
            let fragment = await fileIndex.googleFileController.download(fragments[i],id_user);
            fragmentData.push(fragment);

        }else if(fragments[i].name=='dropbox'){
            let fragment= await fileIndex.dropboxFileController.download(fragments[i],id_user);
            fragmentData.push(fragment);
        }
    }
    resolve(fragmentData);
});
}

module.exports={
    donwload
}