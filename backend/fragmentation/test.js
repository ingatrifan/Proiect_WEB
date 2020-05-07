var fs = require('fs');
const chunk_size =10_000_000;
function fragmentation(file,id_file){
    
    var myfile = fs.readFileSync(file);// testing purposes
    console.log(myfile.length);
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
    fs.writeFileSync(id_file+"_"+number+".byte",chunk);
    //update over here
}
;

async function defragmentation(id_file,size,extension,fileName){
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

fragmentation("test.jar","blabla");
defragmentation("blabla",30222121,"jar","blabla");
