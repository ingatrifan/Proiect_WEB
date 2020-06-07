const HttpStatusCodes = require("http-status-codes");
const models = require('../models/index');
const fileIndex = require('./oauth/authorize/fileIndex');
const validation = require('../utils/checkValidation');
const fragmentation = require('../utils/fragmentation');
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = "SUPER_SECRET_KEY";
const utilities = require('./oauth/authorize/utilityIndex');
const uniq = require('uniqid');
const parser = require('../utils/multipartParser');
const path = require('path');
const fs = require('fs');
exports.upload = async (req,res) => { 
  try {
    let params = await parser.multiPartParse(req,res);  
      let token = params.serverToken.split('\r\n')[2];
      if(validation.checkValidation(token,res)==false)
        return;

    let auth_values = jwt.decode(token,PRIVATE_KEY);
    
    //TO DO VALIDEZ ACCESSTOKEN-URILE: 
      await models.User.findOne({email:auth_values.user},async (err,user)=>{
        if(!err){
          let tokens=[];
          if(checkUserDriveAccounts(res,user)==false) 
            return
          user = await utilities.tokenRefresher.refreshTokens(user);
          tokens.push({info:user.googleAuth});
          tokens.push({info:user.dropboxAuth});
          tokens.push({info:user.oneDriveAuth});
          let filepath=params.filePath;
          //getsize of files -> fragmenting files -> getting the path to fragments ->uploading on drives-> inserting to db + deleting
          getSizes(tokens).then(sizes=>{
            fragmentation.fragmentation(filepath,auth_values.user,sizes)
              .then(fragments=>
              {
                parseUpload(fragments,auth_values.user).then(fragments=>{
                  let fileModel = new models.File({id_user:auth_values.user,fileName:params.fileName,id_file:uniq(),fragments:fragments});
                  fileModel.save().then(()=>{
                    cleanUp(params.filePath,auth_values.user);
                    res.statusCode = HttpStatusCodes.OK;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({"success": true,"message": 'Successfully upload'}));
                  });
                  return ;
                });
              })
          });
        }
      });
  }catch (error) {
    console.error(error)
    res.statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({"success": false, "message": 'Upload Failed'}))
    return ;
  }
}
async function getSizes(tokens){
  let sizeTokens=[];
  let googleTok =tokens[0].info.accessToken//google
  let dropTok = tokens[1].info.accessToken//drop
  let oneTok =tokens[2].info.accessToken//one
  let size;

  if(tokens[0].info.authorized){
    let data= await utilities.google.getDriverInfo(googleTok);    
    size =data.storageQuota.limit-data.storageQuota.usage; 
    sizeTokens.push({size:size,
      authorized:true,
      token:googleTok,
      refreshToken:tokens[0].info.refreshToken,
      lastAccessed: tokens[0].info.lastAccessed,
      folderId:tokens[0].info.folderId
    });
  }else{
    sizeTokens.push({size:0,authorized:false,token:googleTok,refreshToken:tokens[0].info.refreshToken,
      lastAccessed: tokens[0].info.lastAccessed,
      folderId:tokens[0].info.folderId
    });
  } 

  if(tokens[1].info.authorized){
    let data =await utilities.dropbox.getDriverInfo(dropTok);
    size = data.allocation.allocated-data.used;
    sizeTokens.push({size:size,authorized:true,token:dropTok,refreshToken:tokens[1].info.refreshToken,
      lastAccessed: tokens[1].info.lastAccessed});
  }else{
    sizeTokens.push({size:0,authorized:false,token:dropTok,refreshToken:tokens[1].info.refreshToken,
      lastAccessed: tokens[1].info.lastAccessed});
  }

  if(tokens[2].info.authorized){
    let data= await utilities.onedrive.getDriverInfo(oneTok);
    size =data.quota.total-data.quota.used;
    sizeTokens.push({size:size,authorized:true,token:oneTok,refreshToken:tokens[2].info.refreshToken,
      lastAccessed: tokens[2].info.lastAccessed});
  }else{
    sizeTokens.push({size:0,authorized:false,token:oneTok,refreshToken:tokens[2].info.refreshToken,
      lastAccessed: tokens[2].info.lastAccessed});
  }
return sizeTokens;
}
////idea on  upload https://stackoverflow.com/questions/47708226/how-upload-large-files-to-onedrive-using-php-curl
// cuz no documentation for js :(
  
async function parseUpload(fragments,idUser){
  
  return new Promise(async (resove,reject)=>{
    
  for(let i =0 ;i<fragments.length;i++){
    if(fragments[i].name=='onedrive'){
      let onedriveFileData = await fileIndex.onedriveFileController.upload(fragments[i],idUser);
      fragments[i].idFile=onedriveFileData.id;
    }
    else if(fragments[i].name=='dropbox'){
      let dropboxFileData = await fileIndex.dropboxFileController.upload(fragments[i],idUser);
      fragments[i].idFile=dropboxFileData.id;
    }
    else if(fragments[i].name=='google'){
      //check FOLDER STOL first
      fragments[i].folderId =await utilities.google.findOrCreateStolFolder(fragments[i].accessToken);
      let googleDriveData = await fileIndex.googleFileController.upload(fragments[i],idUser);
      fragments[i].idFile = googleDriveData.id;
    }
  }
  resove(fragments);
});
}


function checkUserDriveAccounts(res,user){
  if(user.googleAuth.accessToken==null&&user.dropboxAuth.accessToken==null&&user.oneDriveAuth.accessToken==null){
    res.statusCode = HttpStatusCodes.BAD_REQUEST;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({"success": false, "message": 'You must set at least an account'}));
    return false;
  }
return true;
}
function cleanUp(originalFilePath,userId){
  fs.unlinkSync(originalFilePath);
  let userFolderPath = path.join(process.cwd(),'tmp',userId);
  fragmentation.deleteFolderRecursive(userFolderPath);
}

