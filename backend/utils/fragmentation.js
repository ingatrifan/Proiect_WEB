const fs  = require('fs');
const Path = require('path');
const uniqid = require('uniqid');
const convertHex = require('convert-hex');

const deleteFolderRecursive = function(path) {
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
        if(len==1){
                usedDrive[0].update = fileSize;
        }else{
            if(fileSize/len<usedDrive[0].capacity){
                usedDrive.forEach((data)=>{data.update=fileSize/3});
            }else{
                if(len==2){
                    fileSize=fileSize-usedDrive[0].capacity;
                    usedDrive[0].update=usedDrive[0].capacity;
                    usedDrive[1].update=fileSize;
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
    }
        usedDrive.forEach((data)=>{
            data.update=Math.ceil(data.update);
        })
        return  usedDrive;
  }
async function fragmentation(filepath,id_user,sizes){   
    
    let tmpPath= Path.join(process.cwd(),'tmp',id_user);
    try{
        fs.mkdirSync(tmpPath);
    }catch(e){}
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
        idFile:""
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
        idFile:""
    }
    let google = {
        name:"google",
        capacity:sizes[0].size,
        available:sizes[0].authorized,
        update:0,
        filePath:"",
        p1: 0,
        p2:0,
        accessToken:sizes[0].token,
        refreshToken:sizes[0].refreshToken,
        lastAccessed: sizes[0].lastAccessed,
        fileName:"",
        idFile:"",
        folderId:sizes[0].folderId
    }
    let driveData =[];
    driveData.push(one,dropbox,google)
    console.log(filepath);
    fileSize=fs.statSync(filepath)['size'];
    let usedDrives= findStorage(driveData,fileSize);
    let pos=0;
    for(i in usedDrives){
        usedDrives[i].p1=pos;
        pos +=usedDrives[i].update;
        usedDrives[i].p2=pos;
    
    }
    return await fragment(filepath,tmpPath,usedDrives);      
}
async function fragment(filepath,tmpPath,usedDrives){
    let offset=0;
    let buff;
     let fd  = fs.openSync(filepath,"r");
        for(i in usedDrives){
            let uniq = uniqid();
            let myFilePath = Path.join(tmpPath,usedDrives[i].name+"_"+uniq);
            usedDrives[i].filePath=myFilePath;
            usedDrives[i].fileName=usedDrives[i].name+"_"+uniq;
            let stream = fs.createWriteStream(myFilePath);
            buff = Buffer.alloc(usedDrives[i].p2-usedDrives[i].p1);
            fs.readSync(fd,buff,offset,buff.length,usedDrives[i].p1)
            //let tmp = Buffer.from(buff).toString('hex');
            //buff = Buffer.from(tmp);
            stream.write(buff);
            stream.end();
        }
        fs.closeSync(fd);
    return new Promise((res)=>res(usedDrives));
}
 //fragmentation("./important.txt","test");

module.exports={
    fragmentation,deleteFolderRecursive
}