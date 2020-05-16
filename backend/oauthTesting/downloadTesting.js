const fs = require('fs');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
//important url  : GET https://www.googleapis.com/drive/v2/files
//google : https://www.googleapis.com/drive/v2/files/1a-jFasAJ9BA6igC4e_lIsiDbAcz8RQ2U?alt=media&source=downloadUrl
//https://www.googleapis.com/drive/v2/files/1cjhDUKLhE5VO76eLJdQJNpcAhx_MjKXY?alt=media&source=downloadUrl : 1.png
//token https://www.googleapis.com/drive/v2/files/1cjhDUKLhE5VO76eLJdQJNpcAhx_MjKXY?alt=media
async function  download(accessToken,fileId,filePath){
   const url ='https://www.googleapis.com/drive/v2/files/'+fileId+'?alt=media';
   const curl = new Curl();
   curl.setOpt(Curl.option.URL,url);
   curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
   curl.setOpt(Curl.option.HTTPHEADER,['Authorization: Bearer '+accessToken]);
   const fileOut = fs.openSync(filePath, 'w+')
   curl.setOpt(Curl.option.WRITEFUNCTION, (buff, nmemb, size) => {
    
      let written = 0

  if (fileOut) {
    written = fs.writeSync(fileOut, buff, 0, nmemb * size)
  } else {
    process.stdout.write(buff.toString())
    written = size * nmemb
  }

  return written
  })
   curl.perform()
   curl.on('error', (e)=>{console.log(e);curl.close.bind(curl)})
   return new Promise((response,reject)=>{
   curl.on('end', (statusCode, body) => {
    curl.close()
        response(true);
  })      
});}



    const run = async ()=>{
        
   //let accessToken='';
   let r = await download(accessToken);
   console.log(r);
   
   
    }
run();