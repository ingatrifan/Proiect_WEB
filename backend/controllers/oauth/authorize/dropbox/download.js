const fs = require('fs');
const {Curl } = require('node-libcurl');
const path= require('path');
const request=require('request');
async function  download(accessToken,fileId,userId,fileName,start,end,fileOut){
    return new Promise((response,reject)=>{
        let tempPath = path.join(process.cwd(),'tmp',userId,fileName);
        const url ='https://content.dropboxapi.com/2/files/download';
        const curl = new Curl();
        let str = '{"path" : "'+fileId+'"}';
        curl.setOpt(Curl.option.URL,url);
        curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
        curl.setOpt(Curl.option.HTTPHEADER,
            ['Authorization: Bearer '+accessToken,
            'Dropbox-API-Arg:'+str,
            'Range:bytes='+start+'-'+end
    ]);
        curl.setOpt(Curl.option.RANGE,start+'-'+end);
        curl.setOpt(Curl.option.WRITEFUNCTION, (buff, nmemb, size) => {
            let written = 0;
            if (fileOut) {
                written = fs.writeSync(fileOut, buff, 0, nmemb * size)
            } else {
                
                process.stdout.write(buff.toString())
                written = size * nmemb;
            }
            return written;
    
    });
            curl.perform()
        curl.on('error', (e)=>{console.log(e);curl.close.bind(curl)})
        
        curl.on('end', (statusCode, body) => {
            curl.close()
            response({tmpPath:tempPath});
  })
})

}

const downloadFileInga = async (accessToken,filePath) =>{
    return new Promise((resolve,reject)=>{
    try {
        request.post(
            'https://content.dropboxapi.com/2/files/download',
            {
                headers:{
                    Authorization: 'Bearer '+accessToken ,
                    "Dropbox-API-Arg": "{\"path\": \""+filePath+"\"}"
                }
            } , function resp(err,httprs,body){
                if(err) console.log(err); else 
                //return body;
                resolve('ended');
            })
        
    } catch (error) {
        console.log(error)
        reject(error);
    }
});
}

module.exports={
    download,downloadFileInga
}
