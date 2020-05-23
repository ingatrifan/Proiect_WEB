//PRETTY USELESS NOW, 
const HttpStatusCodes = require("http-status-codes");
const formidable = require("formidable")
const models = require('../models/index');
const fileIndex = require('./oauth/authorize/fileIndex');
const validation = require('../utils/checkValidation');
const fragmentation = require('../utils/fragmentation');
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = "SUPER_SECRET_KEY";
const utilities = require('./oauth/authorize/utilityIndex');
const uniq = require('uniqid');
exports.upload = async (req,res) => { 
  console.log('UPLOAD');
  let token;
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async(err, fields, files) => {

      if (files.file){
        token = fields.serverToken;
        if(validation.checkValidation(token,res)==false)
          return;

        let auth_values = jwt.decode(token,PRIVATE_KEY);
      //TO DO VALIDEZ ACCESSTOKEN-URILE   
        await models.User.findOne({email:auth_values.user},(err,user)=>{
          if(!err){
            let tokens=[];
            tokens.push({info:user.googleAuth});
            tokens.push({info:user.dropboxAuth});
            tokens.push({info:user.oneDriveAuth});
            let filepath=files.file.path;
            console.log(files.file);
            //getsize of files -> fragmenting files -> getting the path to fragments ->uploading on drives-> inserting to db
            getSizes(tokens).then(sizes=>{
              fragmentation.fragmentation(filepath,auth_values.user,sizes)
                .then(fragments=>
                {
                  parseUpload(fragments).then(fragments=>{
                    let fileModel = new models.File({id_user:auth_values.user,fileName:files.file.name,id_file:uniq(),fragments:fragments});
                    fileModel.save().then(console.log("savedFile"));
                  });
                })
            });
            
          }
        });
        res.statusCode = HttpStatusCodes.OK;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({"success": true, "location":'http://localhost:3000/mainPage?serverToken='+token,"message": 'Successfully upload'}));
        return ;
      } else{
        res.statusCode = HttpStatusCodes.BAD_REQUEST;
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({"success": false, "location":'http://localhost:3000/mainPage?serverToken='+token,"message": 'Something bad happened'}));
    return ;
      } 
    });
  } catch (error) {
    console.error(error)
    res.statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({"success": false, "message": 'Something bad happend'}))
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
    sizeTokens.push({size:size,authorized:true,token:googleTok,refreshToken:tokens[0].info.refreshToken});
  }else{
    sizeTokens.push({size:0,authorized:false,token:googleTok,refreshToken:tokens[0].info.refreshToken});
  } 

  if(tokens[1].info.authorized){
    let data =await utilities.dropbox.getDriverInfo(dropTok);
    size = data.allocation.allocated-data.used;
    sizeTokens.push({size:size,authorized:true,token:dropTok,refreshToken:tokens[1].info.refreshToken});
  }else{
    sizeTokens.push({size:0,authorized:false,token:dropTok,refreshToken:tokens[1].info.refreshToken});
  }

  if(tokens[2].info.authorized){
    let data= await utilities.onedrive.getDriverInfo(oneTok);
    size =data.quota.total-data.quota.used;
    sizeTokens.push({size:size,authorized:true,token:oneTok,refreshToken:tokens[2].info.refreshToken});
  }else{
    sizeTokens.push({size:0,authorized:false,token:oneTok,refreshToken:tokens[2].info.refreshToken});
  }
return sizeTokens;
}
////idea on  upload https://stackoverflow.com/questions/47708226/how-upload-large-files-to-onedrive-using-php-curl
// cuz no documentation for js :(
async function parseUpload(fragments){
  return new Promise(async (resove,reject)=>{
  for( i in fragments){
    if(fragments[i].name=='onedrive'){
      let onedriveFileData = await fileIndex.onedriveFileController.upload(fragments[0]);
      fragments[i].idFile=onedriveFileData.id;
    }
    else if(fragments[i].name=='dropbox'){
      //fileIndex.dropboxFileController.upload(fragments[2]);
    }
    else if(fragments[i].name=='google'){
      fileIndex.googleFileController.upload(fragments[1]);
    }
  }
  resove(fragments);
});
}
