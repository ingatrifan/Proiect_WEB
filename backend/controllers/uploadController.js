//PRETTY USELESS NOW, 
const cleanFiles = require('../utils/removingFiles');
const HttpStatusCodes = require("http-status-codes");
const formidable = require("formidable")
const models = require('../models/index');
const fs =require('fs');
const fileIndex = require('./oauth/authorize/fileIndex');
const path = require('path');
const validation = require('../utils/checkValidation');

exports.upload = async (req,res) => { 
  console.log('UPLOAD');
  let token;
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async(err, fields, files) => {

      if (files.file){
        token = fields.serverToken;
        if(validation.checkValidation(token,res)==false)
          return;
        let auth_values = jwt.decode(token,PRIVATE_KEY);
        
        await models.User.findOne({email:auth_values.user},(err,user)=>{
          if(!err){
            let accessToken = user.googleAuth.accessToken;
            let filePath = path.join(process.cwd(),'TEST_1.png');
            fileIndex.googleFileController.upload(accessToken,filePath).then(response=>{
            });
          }
        });
        res.statusCode = HttpStatusCodes.OK
        res.setHeader('Content-Type', 'application/json')
        console.log()
        //res.write(JSON.stringify({"s uccess": true, "location":'http://localhost:3000/mainPage?serverToken='+token,"message": 'Successfully upload'}))
        res.end(JSON.stringify({"success": true, "location":'http://localhost:3000/mainPage?serverToken='+token,"message": 'Successfully upload'}));
        return ;
      } else{
        res.statusCode = HttpStatusCodes.OK
    res.setHeader('Content-Type', 'application/json')
    console.log()
    //res.write(JSON.stringify({"s uccess": true, "location":'http://localhost:3000/mainPage?serverToken='+token,"message": 'Successfully upload'}))
    res.end(JSON.stringify({"success": false, "location":'http://localhost:3000/mainPage?serverToken='+token,"message": 'Something bad happened'}));
    return ;
      } 
    });
  } catch (error) {
    console.error(error)
    res.statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({"success": false, "message": 'Something bad happend'}))
    return ;
  }
}


const chunk_size = 10_000_000;
async function fragmentation(file,file_id){
  var myfile = file;
  var size = myfile.length;
  var i =0 ;
  var jsonArray =[];
  while(size>0){
      var chunk ;
      if(size>chunk_size){
          chunk = myfile.slice(i,i+chunk_size);
          i=i+chunk_size;
      }
      else{
          chunk = myfile.slice(i,i+size);
      }
     let frag=  fragment(chunk,file_id,Math.ceil((myfile.length-size)/chunk_size),size);
      jsonArray.push(frag);
      size = size-chunk_size;
  } 
  return jsonArray;
};  
function fragment(chunk,id_file,number,size){
  fs.writeFileSync("./tmp/"+id_file.split('.')[0]+"_"+number+".byte",chunk);
  //update over here
  let drive ;
  if(number %3==0)
    drive = "dropBox";
  else 
    drive ="google";
  let mySize =chunk_size;
  if(size<chunk_size)
  {
    mySize = size;
  }
  return {"fragment_id":id_file.split('.')[0]+"_"+number+".byte","location":drive,"size":mySize}; 
}


async function addFileDB(file,token){
  try{
      let auth_values = jwt.decode(token,PRIVATE_KEY);
      var file_id = file.name;
      let user =null;
      const File = models.File;
      
      await File.findOne({id_file:file_id},
        function(err,doc){
            if(!err)  {
                user = doc;
            }
     });
     if(user==null){
        
        cleanFiles.cleanTmp();  
        
        let file_tmp = fs.readFileSync(file.path);
          
          let location_array = await fragmentation(file_tmp,file.name);
          console.log(location_array);
          let insertFile = new File({
            id_file :file_id,
            id_user:auth_values.user,
            fragments:location_array
        });
        insertFile.save().then(()=>{console.log("inserted")});
        console.log("INSERTED A FILE");
      return true;
     }
     return false;
  }catch(e){
    return false;
  }
}

