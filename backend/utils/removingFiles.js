const fs = require('fs');
function cleanTmp(){
    fs.readdir('./tmp',(err,files)=>{
      files.forEach(file=>{
        fs.unlinkSync('./tmp/'+file);
      })
    })
  };
  cleanTmp();