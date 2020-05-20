const fs = require('fs');
const utility= require('./utilityFunctions');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
const {credentials}=require('./credentials');
const UPLOAD_URL='https://graph.microsoft.com/v1.0/me/drive';
async function uploadFile(fragment,SESION_UPLOADURL,numBytes,start,end,fileSize,chunkSize,offset){
    let filePath = fragment.filePath;
    let accessToken=fragment.token;
    let contentRange ='bytes '+start +"-"+end+"/"+fileSize;
    return new Promise((resolve,reject)=>{
        fs.open(filePath,'r+',(err,fd)=>{
        const curl = new Curl();
        curl.setOpt(Curl.option.URL,SESION_UPLOADURL);
        curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
        curl.setOpt(Curl.option.HTTPHEADER,[    
            'Content-Length: '+numBytes,
            'Content-Range: '+contentRange
        ]);
        let buff = new Buffer.alloc(numBytes);
        fs.readSync(fd,buff,0,buff.length,offset);
        curl.setOpt(Curl.option.POSTFIELDS,buff.toString());
        curl.setOpt(Curl.option.CUSTOMREQUEST,'PUT')    
        curl.perform()
        curl.on('error', function (error, errorCode) {
                console.log(error);
            fs.closeSync(fd)
            curl.close();
        })
        
            curl.on('end', (statusCode, body) => {
                fs.closeSync(fd)
                resolve(body);
                curl.close();
            })      
    }) 
});}
async function uploadSession(accessToken,filename){
    let dataToSend={
        'item':{
            '@microsoft.graph.conflictBehavior': 'rename',
            'description': 'description',
            'fileSystemInfo': { '@odata.type': 'microsoft.graph.fileSystemInfo' },
            "name": filename
        }
    };
    const curl = new Curl();
    curl.setOpt(Curl.option.URL,UPLOAD_URL+'/root:/Stol/'+filename+':/createUploadSession');
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,["Authorization: Bearer "+accessToken,'Content-Type: application/x-www-form-urlencoded']);
    curl.setOpt(Curl.option.POSTFIELDS,querystring.stringify(dataToSend));
    curl.perform()
    curl.on('error', curl.close.bind(curl))
    return new Promise((resolve,reject)=>{
        curl.on('end', (statusCode, body) => {
            curl.close()
            resolve(JSON.parse(body));
          })      
    })
}
module.exports={
    uploadFile,uploadSession
}