const fs = require('fs');
const {Curl } = require('node-libcurl');
const path= require('path');

async function  download(accessToken,fileId,userId,fileName,start,end,fileOut,hash){
    return new Promise((response,reject)=>{
        let tempPath = path.join(process.cwd(),'tmp',userId,fileName);
        const url ='https://www.googleapis.com/drive/v2/files/'+fileId+'?alt=media';
        const curl = new Curl();
        curl.setOpt(Curl.option.URL,url);
        curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
        curl.setOpt(Curl.option.HTTPHEADER,['Authorization: Bearer '+accessToken]);
        curl.setOpt(Curl.option.RANGE,start+'-'+end);
        curl.setOpt(Curl.option.WRITEFUNCTION, (buff, nmemb, size) => {
            let written = 0;
            if (fileOut) {
                written = fs.writeSync(fileOut, buff, 0, nmemb * size)
                hash.update(buff);
            } else {
                process.stdout.write(buff.toString())
                written = size * nmemb
                
            }
            return written;
    
    });
            curl.perform()
        curl.on('error', (e)=>{console.log(e);curl.close.bind(curl)})
        
        curl.on('end', (statusCode, body) => {
            curl.close()
            response({tmpPath:tempPath,hash:hash});
  })
})

}
module.exports={
    download
}