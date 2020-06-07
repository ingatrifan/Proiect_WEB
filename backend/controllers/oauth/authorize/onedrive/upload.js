const fs = require('fs');
const utility= require('./utilityFunctions');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
const {credentials}=require('./credentials');
const path = require('path');
const UPLOAD_URL='https://graph.microsoft.com/v1.0/me/drive';

async function uploadFile(fragment,SESION_UPLOADURL,numBytes,start,end,fileSize,chunkSize,offset,idUser){
    let filePath = fragment.filePath;
    let accessToken=fragment.accessToken;
    let contentRange ='bytes '+start +"-"+end+"/"+fileSize;
    return new Promise(async (resolve,reject)=>{
        fs.open(filePath,'r+',async (err,fd)=>{
        const curl = new Curl();
        curl.setOpt(Curl.option.URL,SESION_UPLOADURL);
        curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
        curl.setOpt(Curl.option.HTTPHEADER,[    
            'Content-Length: '+numBytes,
            'Content-Range: '+contentRange
        ]);

        let buff = new Buffer.alloc(numBytes);
        fs.readSync(fd,buff,0,buff.length,offset);
        let tmp = path.join(process.cwd(),'tmp',idUser,'fake_tmp.gz');
        await fs.writeFileSync(tmp,buff,);
        let myfd = await fs.openSync(tmp,'r');
        
        //curl.setOpt(Curl.option.POSTFIELDS,buff);
        curl.setOpt(Curl.option.UPLOAD, true)
        curl.setOpt(Curl.option.READDATA, myfd)

        curl.setOpt(Curl.option.CUSTOMREQUEST,'PUT')    
        curl.perform()
        curl.on('error', function (error, errorCode) {
                console.log(error);
            fs.closeSync(fd)
            curl.close();
        })
        
            curl.on('end', async (statusCode, body) => {
                await fs.closeSync(fd)
                await fs.closeSync(myfd);
                await fs.unlinkSync(tmp);
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