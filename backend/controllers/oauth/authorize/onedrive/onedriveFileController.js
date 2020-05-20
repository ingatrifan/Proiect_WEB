const fs = require('fs');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
const {credentials}=require('./credentials');
const uploadFile = require('./upload');
const utils = require('./utilityFunctions');

async function download (token,id_file){
    let fileData = utils.getFileData(token,id_file);
    let downloadUrl = fileData['@microsoft.graph.downloadUrl'];
    console.log();

}

//idea : https://stackoverflow.com/questions/47708226/how-upload-large-files-to-onedrive-using-php-curl
async function upload (fragment){

return new Promise((resolve,reject)=>{
    uploadFile.uploadSession(fragment.token,fragment.fileName)
    .then(async (session)=>{
        console.log("FRAGMENTATION");
        let fragSize=10_000_000;
        let fileSize = fs.lstatSync(fragment.filePath)['size'];
        let numFragements =Math.ceil(fileSize/fragSize);
        let bytesRemaining= fileSize;
        let i =0;
        while(i<numFragements){
            let chunkSize= fragSize;
            let numBytes= fragSize;
            let start = i*fragSize;
            let end =i*fragSize+ chunkSize-1;
            let offset=i*fragSize;
            if(bytesRemaining<chunkSize){
                chunkSize=numBytes;
                numBytes=bytesRemaining;
                end =fileSize-1;
            }
            let data =  await uploadFile.uploadFile(fragment,session.uploadUrl,numBytes,start,end,fileSize,chunkSize,offset);
            if(i==numFragements-1){
                console.log(JSON.parse(data));
                resolve(JSON.parse(data));    
            }
            i++;
            bytesRemaining = bytesRemaining - chunkSize;
            }
        })
    

    });
}


async function remove (req,res){
       
}

module.exports ={
    download,upload,remove
}