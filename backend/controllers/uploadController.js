
const HttpStatusCodes = require("http-status-codes");
const uploadFuncs = require("../utils/upload")
const formidable = require("formidable")
const fs =require('fs');
exports.upload = async (req,res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async(err, fields, files) => {
      
      if (files.file){
      //      
        
        
      //
        //console.log("uploading...");
        ///console.log(typeof(files)+"here",files);
        var file = fs.readFileSync(files.file.path); 

        fragmentation(file,files.file.name.split('.')[0]);
        //var myFile = fs.readFileSync('C:/Users/krelo/Desktop/TW/krello/Proiect_WEB/backend/controllers/index.js');
        

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
;
