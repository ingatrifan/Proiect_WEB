const fs = require('fs');
const utility= require('./utilityFunctions');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
const {credentials}=require('./credentials');
const UPLOAD_URL='https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable';

async function uploadSession(accessToken,folder_id,fileName){
//      check the mettadata stuff
    let data='{"name": '+fileName+', "mimeType": "application/octet-stream", "parents": "['+folder_id+']" }';
    const curl = new Curl();
    curl.setOpt(Curl.option.URL,UPLOAD_URL);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HEADER,true);
    curl.setOpt(Curl.option.POSTFIELDS,data);
    curl.setOpt(Curl.option.HTTPHEADER,["Authorization: Bearer "+accessToken,'Content-Type: application/json; charset=UTF-8',
        'Content-Length: '+data.length
        ]);
    curl.setOpt(Curl.option.POST,true);

    curl.perform()
    curl.on('error', curl.close.bind(curl))
    return new Promise((resolve,reject)=>{
        curl.on('end', (statusCode, body) => {
            curl.close()
            resolve(body);
          })      
    })
}
async function uploadFile(accessToken, filePath,SESION_UPLOADURL){
    let stats= fs.statSync(filePath);
    console.log(SESION_UPLOADURL);
    size = stats['size'];
    fs.open(filePath,'r+',(err,fd)=>{
    const curl = new Curl();
    curl.setOpt(Curl.option.URL,SESION_UPLOADURL);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.UPLOAD, true)
    curl.setOpt(Curl.option.HTTPHEADER,[
        "Authorization: Bearer "+accessToken,
        'Content-Length: '+size,
        'Content-Range: bytes 0-'+size-1+'/'+size,
        'Content-Type: application/octet-stream']);
    curl.setOpt(Curl.option.READDATA, fd)
    curl.setOpt(Curl.option.CUSTOMREQUEST,'PUT')
    curl.perform()
    curl.on('error', function (error, errorCode) {

        fs.closeSync(fd)
        curl.close();
      })
    return new Promise((resolve,reject)=>{
        curl.on('end', (statusCode, body) => {
            fs.closeSync(fd)
            console.log('SUCCESS');
            console.log(body);
            curl.close();
              })      
        }); 
    })
}
module.exports={
 uploadSession,   uploadFile
} 