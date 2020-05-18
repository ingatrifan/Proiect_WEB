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


async function remove (req,res){
    
}

module.exports ={
    download,upload,remove
}