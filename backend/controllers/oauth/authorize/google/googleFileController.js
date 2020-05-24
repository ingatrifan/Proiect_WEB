const fs = require('fs');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
const {credentials}=require('./credentials');
const uploadFile = require('./upload');
const downloadFile = require('./download');
const removeFile=require('./remove');
const utility = require('./utilityFunctions');
const path  = require('path');
async function download (fragment,id_user){
    return new Promise(async(resolve)=>{
        let data = await utility.getFileData(fragment.accessToken,fragment.idFile)
        let fileInfo =JSON.parse(data.body);
        let fileSize= fileInfo.size;

        let tempPath = path.join(process.cwd(),'tmp',id_user,fragment.idFile);
        var fileOut = fs.openSync(tempPath,'w');
        let fragSize = 1_000_000;
        let chunkSize ;
        let offset=0;
        while(offset!=fileSize){
            if(offset+fragSize<=fileSize){
                chunkSize=fragSize
            }else{
                chunkSize=fileSize-offset;
            }
            let start = offset;
            let end = offset+chunkSize-1;
            console.log(offset,start,end);
            await downloadFile.download(fragment.accessToken,fragment.idFile,id_user,fragment.idFile,start,end,fileOut);
            offset = offset+chunkSize;
            console.log(offset,chunkSize);
        }
        await fs.closeSync(fileOut);
        resolve({filePath:tempPath,order:{p1:fragment.p1,p2:fragment.p2},name:fragment.name});
        /*
        var fileOut = fs.openSync(tempPath,'w');
        let tempPath = path.join(process.cwd(),'tmp',id_user,fragment.idFile);
        
        while(){
            

        }
*/

    });

}


async function upload (fragment,idUser){
    return new Promise((resolve,reject)=>{
    uploadFile.uploadSession(fragment.accessToken,fragment.folderId,fragment.fileName).then(async (data)=>{
        let location = 'https'+data.split('\r')[3].split('https')[1];
        let fragSize=2000000;//cam 2mb per chunk
        let fileSize = fs.lstatSync(fragment.filePath)['size'];
        let bytesRemaining= fileSize;
        let chunkSize= fragSize;
        let start = 0;
        let offset=0;
        var check =true;
        while(check){
            if(offset+fragSize<=fileSize){
                chunkSize=fragSize
            }else{
                chunkSize=fileSize-offset;
            }
            try
            {
                let end = start +chunkSize-1;
                let data =  await uploadFile.uploadFile(fragment,location,chunkSize,start,end,fileSize,chunkSize,offset,idUser);
                i++;
                bytesRemaining = bytesRemaining - chunkSize;
                if(data.statusCode==308){
                    start = data.range[1];
                    start ++;
                    offset=start;
                }else if(data.statusCode==200|| data.statusCode==201){
                    check=false;
                    resolve(JSON.parse(data.body));
                }
            }catch(e){
                console.log(e,i);
            }
        }
    }
    );
});
}


async function remove (accessToken,fileId){
    return new Promise (async resolve=>{
        resolve(await removeFile.remove(accessToken,fileId))});
}
module.exports ={
    download,upload,remove
}