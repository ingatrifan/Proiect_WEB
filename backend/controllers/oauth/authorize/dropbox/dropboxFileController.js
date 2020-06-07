const fs = require('fs');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
const {credentials}=require('./credentials');
const uploadFile = require('./upload');
const downloadFile = require('./download');
const path= require('path');
const utility= require('./utilityFunctions');
const removeFile = require('./remove');
async function download(fragment,id_user){
    return new Promise( resolve=>{
    utility.getFileData(fragment.accessToken,fragment.idFile).then( async data=>
    {
        let fileSize = JSON.parse(data.body)['size'];

        let tempPath = path.join(process.cwd(),'tmp',id_user,fragment.idFile.split(':')[1]);
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

    });
    });
}


async function upload (fragment,idUser){
    return new Promise(async resolve=>{
    let fragSize=2000000;//cam 2mb per chunkc
    let fileSize = fs.lstatSync(fragment.filePath)['size'];
    //for small files: at least 2* fragsize cuz one fragSize for begin session, one for finish session
    if(fileSize<fragSize*2)
    {
        let dataSmall=  await uploadFile.smallUpload(fragment.accessToken,fragment.fileName,fragment.filePath);
        resolve(JSON.parse(dataSmall));
    }
    else{
        //continue with big files 
        let fd_origin =  fs.openSync(fragment.filePath);
        let tmp =path.join(process.cwd(),'tmp',idUser,'fake_tmp');
        let chunkSize;
        let begin_offSet=0;
        let data,session_id;

        while(begin_offSet<fileSize){
            if(begin_offSet+fragSize<=fileSize){
                chunkSize=fragSize
            }else{
                chunkSize=fileSize-begin_offSet;
            }
            let buff = new Buffer.alloc(chunkSize);
            await fs.readSync(fd_origin,buff,0,buff.length,begin_offSet);
            await fs.writeFileSync(tmp,buff);
            if(begin_offSet==0){
                data = await uploadFile.startSession(fragment.accessToken,tmp);
                session_id = JSON.parse(data).session_id;
            }
            else{
            if(begin_offSet+chunkSize<fileSize){
                await uploadFile.appendToSession(fragment.accessToken,tmp,session_id ,begin_offSet);
            }
            else{
                data= await uploadFile.finishSession(fragment.accessToken,session_id,begin_offSet,fragment.fileName,tmp);
                
            }
        }
            begin_offSet=begin_offSet+chunkSize;
            await fs.unlinkSync(tmp);
        }
        console.log('finished drop box');
        fs.closeSync(fd_origin);
        resolve(JSON.parse(data));
}
});
}


async function remove (accessToken,fileId){
    return new Promise (async resolve=>{
        resolve(await removeFile.remove(accessToken,fileId))});
}

module.exports ={
    download,upload,remove
}