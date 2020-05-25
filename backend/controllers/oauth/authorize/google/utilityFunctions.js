
const UPLOAD_URL='https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable';
const fs = require('fs');
const myURL=require('url');
const querystring = require('querystring');
const {Curl } = require('node-libcurl');
const {credentials}=require('./credentials');


async function getDriverInfo(accessToken){
    const curl = new Curl();
    const url='https://www.googleapis.com/drive/v3/about?fields=storageQuota';       
    curl.setOpt(Curl.option.URL,url);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,['Authorization: Bearer '+accessToken]);
   // curl.setOpt(Curl.option.CUSTOMREQUEST, "POST");
    curl.on('error', curl.close.bind(curl));
    curl.perform();
    return new Promise((resolve,reject)=>{
        curl.on('end', (statusCode, body) => {
            curl.close()
            //resolve(JSON.parse(body));
            resolve(JSON.parse(body));
          })      
    })
}

async function createFolderSession(accessToken){
    //      check the mettadata stuff
    return new Promise((resolve,reject)=>{
        let data='{"name": "STOL", "mimeType": "application/vnd.google-apps.folder" }';
        const curl = new Curl();
        curl.setOpt(Curl.option.URL,UPLOAD_URL);
        curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
        curl.setOpt(Curl.option.HEADER,true);
        curl.setOpt(Curl.option.POSTFIELDS,data);
        curl.setOpt(Curl.option.HTTPHEADER,["Authorization: Bearer "+accessToken,'Content-Type: application/json; charset=UTF-8',
            'Content-Length: '+data.length
            ]);
        curl.setOpt(Curl.option.POST,true);
    
        curl.perform()
        curl.on('error', curl.close.bind(curl))
        
            curl.on('end', (statusCode, body) => {
                curl.close()
                resolve(body);
              })      
        })
    }


    
async function createThatFolder(accessToken, filePath,SESION_UPLOADURL){
    return new Promise((resolve,reject)=>{
    filePath=process.cwd()+"/empty.txt";
    let stats= fs.statSync(filePath);
    size = stats['size'];
    fs.open(filePath,'r+',(err,fd)=>{
    const curl = new Curl();
    curl.setOpt(Curl.option.URL,SESION_UPLOADURL);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.UPLOAD, true)
    curl.setOpt(Curl.option.HTTPHEADER,[
        "Authorization: Bearer "+accessToken,
        'Content-Length: '+size,
        'Content-Range: bytes 0-'+size-1+'/'+size,
        'Content-Type: application/octet-stream']);
    curl.setOpt(Curl.option.READDATA, fd)
    curl.setOpt(Curl.option.CUSTOMREQUEST,'PUT')
    curl.perform()
    curl.on('error', function (error, errorCode) {

        fs.closeSync(fd)
        curl.close();
      })
    
        curl.on('end', (statusCode, body) => {
            fs.closeSync(fd)
            console.log('CREATED THE FOLDER');
            resolve(JSON.parse(body));
            curl.close();
              })      
        }); 
    })
    
}

async function createFolder(accessToken){
    return new Promise(async (resolve,rej)=>{
    createFolderSession(accessToken).then(data=>{
        let location = 'https'+data.split('\r')[3].split('https')[1];
        createThatFolder(accessToken,"",location).then(data=>
            {
                resolve(data.id);
            });
    });
});

}
async function getFileData(accessToken,idFile){//basically as one bellow but has a field
    return new Promise( async (resolve)=>{
        const curl = new Curl();
        const url='https://www.googleapis.com/drive/v3/files/'+idFile+'?fields=*';       
        curl.setOpt(Curl.option.URL,url);
        curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
        curl.setOpt(Curl.option.HTTPHEADER,['Authorization: Bearer '+accessToken]);
        curl.setOpt(Curl.option.CUSTOMREQUEST, "GET");
        curl.on('error', curl.close.bind(curl));
        curl.perform();
            curl.on('end', (statusCode, body) => {
                curl.close()
                let result ={body: body,statusCode:statusCode}
                resolve(result);
              })      
        })
}
async function checkFileById(accessToken,idFile){//basically for folder id 

    return new Promise( async (resolve)=>{
    const curl = new Curl();
    const url='https://www.googleapis.com/drive/v3/files/'+idFile;       
    curl.setOpt(Curl.option.URL,url);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,['Authorization: Bearer '+accessToken]);
    curl.setOpt(Curl.option.CUSTOMREQUEST, "GET");
    curl.on('error', curl.close.bind(curl));
    curl.perform();
        curl.on('end', (statusCode, body) => {
            curl.close()
            let result ={body: body,statusCode:statusCode}
            resolve(result);
          })      
    })
}

async function listFiles(accessToken){//basically for folder id 

    return new Promise( async (resolve)=>{
    const curl = new Curl();
    const url='https://www.googleapis.com/drive/v3/files';       
    curl.setOpt(Curl.option.URL,url);
    curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
    curl.setOpt(Curl.option.HTTPHEADER,['Authorization: Bearer '+accessToken]);
    curl.setOpt(Curl.option.CUSTOMREQUEST, "GET");
    curl.on('error', curl.close.bind(curl));
    curl.perform();
    
        curl.on('end', (statusCode, body) => {
            curl.close()
            resolve(JSON.parse(body));
          })      
    })
}
async function findFolderByName(accessToken,folderName){
    return new Promise(async resolve=>{
    let fileData =await  listFiles(accessToken);
    let files = fileData.files;
    for(i in files){
        if(files[i].mimeType=='application/vnd.google-apps.folder'&&files[i].name==folderName){
            resolve(files[i].id);
        }
    }
    resolve(false);
});
}

async function findOrCreateStolFolder(accessToken){
    return new Promise(async (resolve)=>{
        let folderId= '';
        let response = await findFolderByName(accessToken,'STOL');
        if(response==false)

            folderId=await createFolder(accessToken);
        else
            folderId=response;
            resolve(folderId);
    });
}
module.exports={
    getDriverInfo,createFolder,checkFileById,findFolderByName,findOrCreateStolFolder,listFiles,getFileData
}