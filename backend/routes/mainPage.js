const url = require('url');
const jwt = require('jsonwebtoken');
const models = require('../models/index');
const PRIVATE_KEY = "SUPER_SECRET_KEY";
const { escapeRegexSearch } = require('../utils/helper');

async function mainPage(req,res){
    try{
        let {serverToken,search,parent} = url.parse(req.url, true).query;
        try{
            jwt.verify(serverToken,PRIVATE_KEY);
            let r = await renderMainPage(serverToken,search,parent).then((data)=> {
                let json = JSON.stringify(data)
                res.writeHead(200,{
                    'Content-Type': 'application/json',
                    'content-length': Buffer.byteLength(json)
                });
                return res.end(json);
            });
        }
        catch(e) {
            res.writeHead(404,'NO AUTHENTIFICATION' );    
            return res.end();
        }
    } 
    catch(e){
        res.end();
    }       
}


async function renderMainPage(token,search,parent){
    return new Promise(async (resolve)=>{
        const File = models.File;
        let auth_values = jwt.decode(token,PRIVATE_KEY);
        if(search &&search.length>0){
            let regex = escapeRegexSearch(search);
            File.find({$or : [{fileName:regex}]}, (err,files) =>{
                if (err)console.error(err);
                data = {
                    "folder":{
                        "files":[]
                    }
                }
                for ( i in files){
                    let obj =files[i].fileName.split('.');
                    data.folder.files.push({"name":obj[0],"extension":obj[1],"idFile":files[i].id_file});
                }
                resolve(data);
            });
        } 
        if (!parent)parent = null;
        await File.find({id_user:auth_values.user,folder:parent},(err,files)=>{
            if(!err){
            }
        }).then(async (listFiles)=>{
            console.log(listFiles)
            data = {
                "folder":{
                    "files":[]
                }
            }
            for (i in listFiles){
                let obj =listFiles[i].fileName.split('.');
                if(obj[1]==null)obj[1]="folder";
                let extension = inExtenstionList(obj[1]);
                let fileId = extension=="folder"?listFiles[i].id:listFiles[i].id_file;
                data.folder.files.push({"name":obj[0],"extension":extension,"idFile": fileId});
            }
            resolve(data);
        });
    }); 
}
module.exports={
    mainPage,
    renderMainPage
}
const extensionList=[
 "folder","aac","ai","aiff","asp","avi","bmp","c","cpp","css","dat","dmg","doc","docs","dot","dotx","dwg","dxf","eps","exe","flv","git","h","html",
"ics","iso,","jar","java","jpg","js","key","m4v","mid","mov","mp3","mp4","mgg","odp","ods","odt","otp","ots","ott","pdf","php","png","pps",
"ppt","psd","py","qt","rar","rb","rtf","sql","tga","tgz","tiff","txt","wav","xls","xlsx","xml","yml","zip"];
function inExtenstionList(extension){
    for(let i= 0 ;i<extensionList.length;i++){
        if(extension==extensionList[i]){
            return extension;
        }
    }
    return "default";
}