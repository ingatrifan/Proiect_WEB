const fs  = require('fs');
const Path = require('path');

const deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file, index) => {
        const curPath = Path.join(path, file);
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };

  function findStorage(google,one,dropbox,fileSize){
        console.log(google.available);
  }
function fragmentation(filepath,id_user){   
    len=5;
    let tmpPath= Path.join(process.cwd(),'tmp',id_user);
    deleteFolderRecursive(tmpPath);
    try{
        
    }catch(e){}
    let buff =Buffer.alloc(len);
    let pos =0;
    let offset=0;
    let google = {
        store:1000,
        available:true
    }
    
    

    let one = {
        value:1000,
        available:true
    }
    let dropbox = {
        store:1000,
        available:true
    }
    let fileSize=100;
    findStorage(google,one,dropbox,fileSize);

    fs.open(filepath, 'r', (err, fd) => {
        console.log(fd);
        fs.read(fd, buff, offset, len, pos,
        (err, bytes, buff) => { 
            
        })

    
    
    
    });
        
}
fragmentation("./important.txt","");

