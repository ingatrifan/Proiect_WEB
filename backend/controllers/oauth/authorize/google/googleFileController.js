const fs = require('fs');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
const {credentials}=require('./credentials');
const uploadFile = require('./upload');
const downloadFile = require('./download');
const utility = require('./utilityFunctions');
async function download (fragment,id_user){
    return new Promise(async(resolve)=>{

        await downloadFile.download(fragment.accessToken,fragment.idFile,id_user,fragment.fileName,start);


    });

}


async function upload (fragment){
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
                let data =  await uploadFile.uploadFile(fragment,location,chunkSize,start,end,fileSize,chunkSize,offset);
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


async function remove (req,res){
    
}

module.exports ={
    download,upload,remove
}