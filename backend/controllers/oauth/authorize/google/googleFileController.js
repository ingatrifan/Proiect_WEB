const fs = require('fs');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
const {credentials}=require('./credentials');
const uploadFile = require('./upload');
const utility = require('./utilityFunctions');
async function download (req,res){
    
}


async function upload (accessToken,filepath){
    utility.getDriverInfo(accessToken).then(res=>{
        //console.log(res);
        
        fs.writeFileSync('./out.txt',res)
    });
    utility.createFolder().then(res=>console.log(res));///NOTE : this must be created once the user logged with his account, and
    // and the id must be stored in database

    uploadFile.uploadSession(accessToken,folder_id).then((data)=>{
        let location = 'https'+data.split('\r')[3].split('https')[1];
        
        uploadFile.uploadFile(accessToken,filepath,location).then(data=>{
            
        })
    }
    );
}


async function remove (accessToken,fileId){
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
  const curl = new Curl();
  curl.setOpt(Curl,Option.URL,url);
  curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
  curl.setOpt(Curl.option.HTTPHEADER,['Authorization: Bearer '+accessToken]);
  curl.setOpt(Curl.option.CUSTOMREQUEST,'DELETE');
  curl.on('error', curl.close.bind(curl));
  curl.perform();

  return new Promise((resolve,reject)=> {
    curl.on('end', (statusCode,body) => {
      if(statusCode!== 204) {
        console.log('Error while trying to delete the file...[googledrive]')
      }
      curl.close();
    });
  });
}

module.exports ={
    download,upload,remove
}