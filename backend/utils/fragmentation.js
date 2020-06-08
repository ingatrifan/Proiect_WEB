const fs  = require('fs');
const Path = require('path');
const uniqid = require('uniqid');
const crypto = require('crypto');
const deleteFolderRecursive = function(path) {
    try{
        if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file, index) => {
            const curPath = Path.join(path, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
            deleteFolderRecursive(curPath);
            } else { 
            fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
        }
        }
    catch(e){}
  };

 function findStorage(driveData,fileSize){
        let usedDrive=[];
        let totalSize =0;
        for( i in driveData)
            if(driveData[i].available==true)            
                {usedDrive.push(driveData[i]);
                    totalSize+=driveData[i].capacity;       
                }
        if(totalSize<fileSize+3)
            return false;
        
        usedDrive.sort((a,b)=>a.capacity-b.capacity);
        let len = usedDrive.length;
        if(len==1)
            usedDrive[0].update = fileSize;

        else if(len==2){
            if(fileSize/len<usedDrive[0].capacity){
                usedDrive.forEach((data)=>{data.update=fileSize/len});
            }
            else{
                fileSize= fileSize-usedDrive[0].capacity;
                usedDrive[0].update=usedDrive[0].capacity;   
                update[1].update= fileSize;
            }
        }else if(len==3){
            if(fileSize/len<usedDrive[0].capacity){
                usedDrive.forEach((data)=>{data.update=fileSize/3});
            }else{
                fileSize= fileSize-usedDrive[0].capacity;
                    usedDrive[0].update=usedDrive[0].capacity;
                    if(fileSize<usedDrive[1].capacity){
                        usedDrive[2].update=fileSize/2;
                        usedDrive[1].update=fileSize/2
                    }else{
                        fileSize=fileSize-usedDrive[1].capacity;
                        usedDrive[2].update=fileSize;
                        usedDrive[1].update=usedDrive[1].capacity;
                    }   
            }
        }
        usedDrive.forEach((data)=>{
            data.update=Math.ceil(data.update);
        })
        return  usedDrive;
  }
async function fragmentation(filepath,id_user,sizes){   
    
    
    let one = {
        name:"onedrive",
        capacity:sizes[2].size,
        available:sizes[2].authorized,
        update:0,
        filePath:"",//p1,p2 folositi pentru a determinat din ce pozitie va incepe sa citeasca din fisier
        p1: 0,
        p2:0,
        accessToken:sizes[2].token,
        refreshToken:sizes[2].refreshToken,
        lastAccessed: sizes[2].lastAccessed,
        fileName:"",
        idFile:"",
        hash:""
    }   
    let dropbox = {
        name:"dropbox",
        capacity:sizes[1].size,
        available:sizes[1].authorized,
        update:0,
        filePath:"",
        p1:0 ,
        p2:0,
        accessToken:sizes[1].token,
        refreshToken:sizes[1].refreshToken,
        lastAccessed: sizes[1].lastAccessed,
        fileName:"",
        idFile:"",
        hash:""
    }
    let google = {
        name:"google",
        capacity:sizes[0].size,
        available:sizes[0].authorized,
        update:0,
        filePath:"",
        p1:0,
        p2:0,
        accessToken:sizes[0].token,
        refreshToken:sizes[0].refreshToken,
        lastAccessed: sizes[0].lastAccessed,
        fileName:"",
        idFile:"",
        folderId:sizes[0].folderId,
        hash:""
    }
    let driveData =[];
    driveData.push(one,dropbox,google)
    fileSize=fs.statSync(filepath)['size'];
    let tmpPath= Path.join(process.cwd(),'tmp',id_user);
    try{
        await fs.mkdirSync(tmpPath);    
    }
    catch(e){}
    let usedDrives= findStorage(driveData,fileSize);
    let pos=0;
    for(i in usedDrives){
        usedDrives[i].p1=pos;
        pos +=usedDrives[i].update;
        usedDrives[i].p2=pos;
    }
    let res = await fragment(filepath,tmpPath,usedDrives);      
    return new Promise(resolve=>resolve(res));
}
async function fragment(filepath,tmpPath,usedDrives){
    return new Promise(async (res)=>{
    let offset=0;
    let buff;
     let fd  = fs.openSync(filepath,"r");
     var stream;
        for(let i=0;i<usedDrives.length;i++){
            let uniq = uniqid();
            let firtName= 'stolFile';
            let myFilePath = Path.join(tmpPath,firtName+"_"+uniq);
            usedDrives[i].filePath=myFilePath;
            usedDrives[i].fileName=firtName+"_"+uniq;
            usedDrives[i].hash=  await createFragment(myFilePath,usedDrives,i,fd);
        }
        fs.closeSync(fd);
        res(usedDrives);
    });
}

 async function createFragment(myFilePath,usedDrives,i,fd){
    const hash = crypto.createHash('sha256');
     return new Promise( async (resolve)=>{
        let stream = fs.createWriteStream(myFilePath);
        buff = Buffer.alloc(usedDrives[i].p2-usedDrives[i].p1);
        fs.readSync(fd,buff,0,buff.length,usedDrives[i].p1)
        hash.update(buff);
        stream.write(buff);
        stream.end(()=>{resolve(hash.digest('hex'))})
     });
 }
module.exports={
    fragmentation,deleteFolderRecursive
}