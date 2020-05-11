const jwt = require('jsonwebtoken');
const cleanFiles = require('../utils/removingFiles');
const HttpStatusCodes = require("http-status-codes");
const uploadFuncs = require("../utils/upload")
const formidable = require("formidable")
const models = require('../models/index');
const fs =require('fs');
const PRIVATE_KEY = "SUPER_SECRET_KEY";
exports.upload = async (req,res) => { 
  console.log('UPLOAD');
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async(err, fields, files) => {
      //const token = files.serverToken;
      
      
      
      
      if (files.file){
          
        var check = await addFileDB(files.file,fields.serverToken);
        console.log(check,"value");
        if(check){
          cleanFiles.cleanTmp();  
        }
  
        //fragmentation(file,files.file.name.split('.')[0]);



        //        await uploadFuncs.dropboxUpload(myFile); 
        }
        
      
  
    });
    res.statusCode = HttpStatusCodes.OK
    res.setHeader('Content-Type', 'application/json')
    return res.write(JSON.stringify({success: true, message: 'Successfully upload'}))
  } catch (error) {
    console.error(error)
    res.statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({success: false, message: 'Something bad happend'}))
  }
}


const chunk_size = 10_000_000;
function fragmentation(file,id_file){
    
  var myfile = file;
  var size = myfile.length;
  var i =0 ;
  while(size>0){
      var chunk ;
      if(size>chunk_size){
          chunk = myfile.slice(i,i+chunk_size);
          i=i+chunk_size;
      }
      else{
          chunk = myfile.slice(i,i+size);
      }
      fragment(chunk,id_file,Math.ceil((myfile.length-size)/chunk_size));

      size = size-chunk_size;
  }
  
};
function fragment(chunk,id_file,number){
  fs.writeFileSync("./tmp/"+id_file+"_"+number+".byte",chunk);
  //update over here
}


async function addFileDB(file,token){
  try{
    
      jwt.verify(token,PRIVATE_KEY);
      let auth_values = jwt.decode(token,PRIVATE_KEY);
      console.log(token,auth_values);
      var file_id = file.name;
      console.log("HERE");
      let user =null;
      const File = models.File;
      
      await File.findOne({id_file:file_id},
        function(err,doc){
            if(!err)  {
                user = doc;
                console.log(user);
            }
     });
     console.log("HERE");
     if(user==null){
        let insertFile = new File({
            id_file :file_id,
            id_user:auth_values.user
        });
        await insertFile.save(()=>{
          console.log("INSERTED A FILE");
        });
      return true;
     }
     return false;
  }catch(e){
    return false;
  }
}

