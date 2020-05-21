const fs = require('fs');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
const {credentials}=require('./credentials');
const uploadFile = require('./upload');
const utils = require('./utilityFunctions');
const downloadFile = require('./download');
//same as upload basically
async function download (token,fragment,id_user){
    return new Promise(async (resolve)=>{
        
    await utils.getFileData(token,fragment.idFile).then( async(data)=>
        {
            let donwloadUrl = data['@microsoft.graph.downloadUrl'];
            console.log('HERERE',data);

            let fragSize=10_000_000;
            let fileSize = data['size'];
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
            let tmpPath = await downloadFile.downloadFile(donwloadUrl,id_user,fragment.idFile,start,end);
            if(i==numFragements-1){
                //console.log(JSON.parse(data));
               //resolve(JSON.parse(data));    
               resolve({filePath:tmpPath,order:{p1:fragment.p1,p2:fragment.p2},name:fragment.name});
            }
            i++;
            bytesRemaining = bytesRemaining - chunkSize;
            }
        })});
        
}

//idea : https://stackoverflow.com/questions/47708226/how-upload-large-files-to-onedrive-using-php-curl
async function upload (fragment){

return new Promise((resolve,reject)=>{
    uploadFile.uploadSession(fragment.token,fragment.fileName)
    .then(async (session)=>{
        //console.log("FRAGMENTATION");
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