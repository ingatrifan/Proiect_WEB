//refragmentation
//need modify

var fs = require('fs');
const chunk_size =10_000_000;
async function refragmentation(id_file,size,extension,fileName){
    var out = new Buffer.alloc(size);
    var i=0;
    //some sort of find here
    fs.readdirSync("./").forEach(file=>{
        if(file.split('_')[0]==id_file){
            myFile= fs.readFileSync(file);
            console.log(myFile.length,chunk_size/myFile.length);
            if(myFile.length/chunk_size==1){
                myFile.copy(out,i);
        
                i=i+chunk_size;
            }
            else{
                myFile.copy(out,i);
                i=i+myFile.length;
            }
        }
    });
    fs.writeFileSync(fileName+"."+extension,out);
    console.log(out);

};
