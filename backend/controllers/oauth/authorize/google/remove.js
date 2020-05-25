const {Curl} = require('node-libcurl');


async function remove (accessToken,fileId){
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
    const curl = new Curl();
    curl.setOpt(Curl.option.URL,url);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,['Authorization: Bearer '+accessToken]);
    curl.setOpt(Curl.option.CUSTOMREQUEST,'DELETE');
    curl.on('error', curl.close.bind(curl));
    curl.perform();
  
    return new Promise((resolve,reject)=> {
      curl.on('end', (statusCode,body) => {
        if(statusCode!== 204) {
          console.log('Error while trying to delete the file...[googledrive]')
          console.log(body,statusCode);
          //HANDLING THROWS 
        }
        resolve(statusCode);
        curl.close();
      });
    });
  }
  
  module.exports={
      remove
  }