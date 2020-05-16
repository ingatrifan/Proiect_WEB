const fs = require('fs');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
const {credentials}=require('./credentials');
const uploadFile = require('./upload');
const utils = require('./utilityFunctions');
async function download (req,res){

}


async function upload (accessToken, filePath){
    let r = await uploadFile.uploadSession(accessToken,'test.png');    
    console.log(r);
    let stats = fs.statSync(filePath);
    let size = stats['size'];
    uploadFile.uploadFile(accessToken,filePath,r.uploadUrl);
    //uploadFile.upload(accessToken,filePath,size);
    /*
    utils.getDriverInfo(accessToken).then((data)=>{
        //let remaining = data.quota.remaining;
        

      })*/
}


async function remove (req,res){
    
}

module.exports ={
    download,upload,remove
}