const fs = require('fs');
const {Curl } = require('node-libcurl');
const path= require('path');

async function downloadFile(donwnloadURL,userId,fileName,start,end,position,fileOut,hash){
    return new Promise((response,reject)=>{
    let tempPath = path.join(process.cwd(),'tmp',userId,fileName);
    let range ='bytes='+start+'-'+end
    const curl = new Curl();
   curl.setOpt(Curl.option.URL,donwnloadURL);
   curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,['Range: '+range]);
    //let stream = fs.createWriteStream(tempPath);
    curl.setOpt(Curl.option.WRITEFUNCTION, (buff, nmemb, size) => {
        let written = 0
      
        if (fileOut) {
          written = fs.writeSync(fileOut, buff, 0, nmemb * size);
          hash.update(buff);
        } else {
          written = size * nmemb
        }
      
        return written
      })
      
   curl.perform()
   curl.on('error', (e)=>{console.log(e);curl.close.bind(curl)})
   curl.on('end', (statusCode, body) => {
        curl.close()
        response({tmpPath:tempPath,position:position,hash:hash});
  })});}

module.exports={
    downloadFile
}