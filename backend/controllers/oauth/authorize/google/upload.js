const fs = require('fs');
const request = require('request');
const utility= require('./utilityFunctions');
const myURL=require('url');
const querystring = require('querystring');
const {Curl ,CurlHttpVersion} = require('node-libcurl');
const {credentials}=require('./credentials');
const UPLOAD_URL='https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable';
const path = require('path');

async function uploadSession(accessToken,folder_id,fileName){
    return new Promise((resolve,reject)=>{
//      check the mettadata stuff : DONE
    let data='{"title": "'+fileName+'","name":"'+fileName+'", "mimeType": "application/octet-stream", "parents": ["'+folder_id+'"] }';
    //verry important to put quotes in parrents array
    const curl = new Curl();
    curl.setOpt(Curl.option.URL,UPLOAD_URL);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HEADER,true);
    curl.setOpt(Curl.option.POSTFIELDS,data);
    curl.setOpt(Curl.option.HTTP_VERSION,CurlHttpVersion.V1_1);
    curl.setOpt(Curl.option.HTTPHEADER,["Authorization: Bearer "+accessToken,'Content-Type: application/json; charset=UTF-8',
        'Content-Length: '+data.length
        ]);
    curl.setOpt(Curl.option.POST,true);

    curl.perform()
    curl.on('error', curl.close.bind(curl))
    
        curl.on('end', (statusCode, body) => {
            curl.close()
            resolve(body);
          })      
    })
}
async function uploadFile(fragment,SESION_UPLOADURL,numBytes,start,end,fileSize,chunkSize,offset,idUser){
    let filePath = fragment.filePath;
    let accessToken=fragment.accessToken;
    let contentRange ='bytes '+start +"-"+end+"/"+fileSize;
    return new Promise(async (resolve,reject)=>{
    fs.open(filePath,'r+', async (err,fd)=>{
    const curl = new Curl();
    curl.setOpt(Curl.option.URL,SESION_UPLOADURL);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    //curl.setOpt(Curl.option.);
    curl.setOpt(Curl.option.HTTPHEADER,[
        "Authorization: Bearer "+accessToken,
        'Content-Length: '+numBytes,
        'Content-Range:'+contentRange,
        'Content-Type: application/octet-stream']);
    let buff = new Buffer.alloc(numBytes);
    fs.readSync(fd,buff,0,buff.length,offset);
    let tmp = path.join(process.cwd(),'tmp',idUser,'fake_tmp.gz');
    await fs.writeFileSync(tmp,buff,);
    var myfd = await fs.openSync(tmp,'r');
    //very important
    curl.setOpt(Curl.option.UPLOAD, true)
    curl.setOpt(Curl.option.READDATA, myfd)
    curl.setOpt(Curl.option.HTTP_VERSION,CurlHttpVersion.V1_1);
    curl.setOpt(Curl.option.CUSTOMREQUEST,'PUT')
    curl.perform()
    curl.on('error', function (error, errorCode) {
        console.log('ERROR HAPPENING',error);
        reject('nothing');
        fs.closeSync(fd)
        curl.close();
      })
        curl.on('end', async  (statusCode, body,more) => {
            curl.close();
            await fs.closeSync(fd)
            await fs.closeSync(myfd);
            await fs.unlinkSync(tmp);
            if(statusCode==308)//get range
            {
                let range = more[0].range.split('=')[1].split('-');
                resolve({statusCode:statusCode,range:range});
            }
            if(statusCode==200||statusCode==201){
                resolve({statusCode:statusCode,body:body});
            }
            else resolve({statusCode});
            
              });
        })
    });
}

module.exports={
 uploadSession,   uploadFile
} 