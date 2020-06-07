const fs = require('fs');
const utils = require('./utilityFunctions');
const uploadFile = require('./upload');
const downloadFile = require('./download');
const removeFile=require('./remove');
const path = require('path');
const crypto =require('crypto');
//same as upload basically
async function download (fragment,id_user){
    return new Promise(async (resolve)=>{
        //bug la downloadat sau uploadat , nu este aceasi fila neaparat
    await utils.getFileData(fragment.accessToken,fragment.idFile).then( async(data)=>
        {
            let donwloadUrl = data['@microsoft.graph.downloadUrl'];
            let fragSize=1_000_000;
            let fileSize = data['size'];
            let numFragements =Math.ceil(fileSize/fragSize);
            let bytesRemaining= fileSize;
            let i =0;
            let hash = crypto.createHash('sha256');
            var position=0;
            let tempPath = path.join(process.cwd(),'tmp',id_user,fragment.idFile);
            var fileOut = fs.openSync(tempPath,'w');
        while(i<numFragements){
            console.log(i);
            let chunkSize= fragSize;
            let numBytes= fragSize;
            let start = i*fragSize;
            let end =i*fragSize+ chunkSize-1;
            
            if(bytesRemaining<chunkSize){
                chunkSize=numBytes;
                numBytes=bytesRemaining;
                end =fileSize-1;
            }
            let data = await downloadFile.downloadFile(donwloadUrl,id_user,fragment.idFile,start,end,position,fileOut,hash);
            hash =data.hash;
            position=data.position;
            if(i==numFragements-1){
                fs.closeSync(fileOut);
                if(hash.digest('hex')==fragment.hash){
                    resolve({filePath:data.tmpPath,order:{p1:fragment.p1,p2:fragment.p2},name:fragment.name});
                }
                else{
                    resolve(false);
                }
            }
            i++;
            bytesRemaining = bytesRemaining - chunkSize;
            }
        })});
        
}

//idea : https://stackoverflow.com/questions/47708226/how-upload-large-files-to-onedrive-using-php-curl
async function upload (fragment,idUser){

return new Promise((resolve,reject)=>{
    uploadFile.uploadSession(fragment.accessToken,fragment.fileName)
    .then(async (session)=>{
        //console.log("FRAGMENTATION");
        let fragSize=1_000_000;
        let fileSize = fs.lstatSync(fragment.filePath)['size'];
        
        let numFragements =Math.ceil(fileSize/fragSize);
        let bytesRemaining= fileSize;
        let i =0;
        console.log(i,numFragements,fileSize);
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
            let data =  await uploadFile.uploadFile(fragment,session.uploadUrl,numBytes,start,end,fileSize,chunkSize,offset,idUser);
            if(i==numFragements-1){
                //console.log(JSON.parse(data));
                console.log(data);
                resolve(JSON.parse(data));    
            }
            i++;
            bytesRemaining = bytesRemaining - chunkSize;
            }
        })
    });
}

async function remove (accessToken,fileId){
    return new Promise (async resolve=>{
        resolve(await removeFile.remove(accessToken,fileId))});
}

module.exports ={
    download,upload,remove
}