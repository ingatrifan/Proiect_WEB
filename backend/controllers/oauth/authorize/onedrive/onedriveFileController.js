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

async function download(accessToken, fileId, filePath) {
    
    const download_url = `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}`;

    const curl = new Curl();
    curl.setOpt(Curl.option.URL,download_url);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,['Authorization: Bearer '+accessToken]);
    curl.setOpt(Curl.option.HTTPGET);

    const fileOut = fs.openSync(filePath,'w+')

    curl.setOpt(Curl.option.WRITEFUNCTION, (buff, nmemb, size) => {
        let written = 0
    if (fileOut) {
      written = fs.writeSync(fileOut, buff, 0, nmemb * size)
    } else {
      process.stdout.write(buff.toString())
      written = size * nmemb
    }
  
    return written
    });

    curl.perform()
    curl.on('error', (e)=>{console.log(e);curl.close.bind(curl)})
    return new Promise((response,reject)=>{
        curl.on('end', (statusCode, body) => {
        curl.close()
        response(true);
        });      
    });
}



async function remove (accessToken, fileId) {
    const curl = new Curl();
    const delete_url = `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}`;
    curl.setOpt(Curl.option.URL,delete_url);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,['Authorization: Bearer '+accessToken]);
    curl.setOpt(Curl.option.CUSTOMREQUEST,'DELETE');
    curl.perform();
    return new Promise((resolve,reject)=>{
        curl.on('end', (statusCode, body) => {
            curl.close()
            resolve(statusCode);
          })      
    })
}

module.exports ={
    download,upload,remove
}