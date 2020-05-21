const fs = require('fs');
const {Curl } = require('node-libcurl');
const path= require('path');
const convertHex = require('convert-hex');

async function downloadFile(donwnloadURL,userId,fileName,start,end){
    return new Promise((response,reject)=>{
    console.log('HERER',userId,fileName);
    let tempPath = path.join(process.cwd(),'tmp',userId,fileName);
    console.log(donwnloadURL);
    let range ='bytes='+start+'-'+end
    const curl = new Curl();
   curl.setOpt(Curl.option.URL,donwnloadURL);
   curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,['Range: '+range]);
   let fileOut = fs.openSync(tempPath, 'w')
   curl.perform()
   curl.on('error', (e)=>{console.log(e);curl.close.bind(curl)})
   curl.on('end', (statusCode, body) => {
       //decode
        let buff =body.toString();
        buff=Buffer.from(buff,'hex').toString();
        //console.log(buff);  
        fs.writeSync(fileOut,buff,0,buff.length,start) ;
        fs.closeSync(fileOut);
        curl.close()
        response(tempPath);
  })});}

module.exports={
    downloadFile
}