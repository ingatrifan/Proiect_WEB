const models = require('../models/index');
const fs =require('fs');
const fileIndex = require('./oauth/authorize/fileIndex');
const validation = require('../utils/checkValidation');
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = "SUPER_SECRET_KEY";
const url = require('url');
const refragmentation = require('../utils/refregmentation');

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
    
    await models.File.findOne({id_user:auth_values.user,id_file:idFile},(err,file)=>{
        let fragments = file.fragments;
        parseDownload(fragments,auth_values.user).then(fragments=>{
            refragmentation.refragmentation(fragments,auth_values.user,file.fileName).then(fileOut=>{
                let stream  = fs.createReadStream(fileOut);
                stream.pipe(res);
            })
        });
    });
}



async function parseDownload(fragments,id_user){ 
    let fragmentData=[];
    return new Promise(async (resolve)=>{
    for( i in fragments){
        if(fragments[i].name=='onedrive'){
            let fragment = await fileIndex.onedriveFileController.download(fragments[i],id_user);
            fragmentData.push(fragment);
        }else if(fragments[i].name=='google'){
            let fragment = await fileIndex.googleFileController.download(fragments[i],id_user);
            fragmentData.push(fragment);

        }else if(fragments[i].name=='dropbox'){
            //TODO
        }
    }
    resolve(fragmentData);
});
}

module.exports={
    donwload
}