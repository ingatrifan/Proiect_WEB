

const fs = require('fs');
const {Curl } = require('node-libcurl');
const path= require('path');
const convertHex = require('convert-hex');

async function  download(accessToken,fileId,userId,fileName,start){
    return new Promise((response,reject)=>{
        let tempPath = path.join(process.cwd(),'tmp',userId,fileName);
        const url ='https://www.googleapis.com/drive/v2/files/'+fileId+'?alt=media';
        const curl = new Curl();
        curl.setOpt(Curl.option.URL,url);
        curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
        curl.setOpt(Curl.option.HTTPHEADER,['Authorization: Bearer '+accessToken]);
        const fileOut = fs.openSync(tempPath, 'w+')
        curl.setOpt(Curl.option.WRITEFUNCTION, (buff, nmemb, size) => {
        let written = 0
        if (fileOut) {
            written = fs.writeSync(fileOut, buff, 0, nmemb * size,start)

        } else {
            process.stdout.write(buff.toString())
            written = size * nmemb
        }});
            curl.perform()
        curl.on('error', (e)=>{console.log(e);curl.close.bind(curl)})
        
        curl.on('end', (statusCode, body) => {
            curl.close()
            response(true);
  })
})

}
module.exports={
    download
}