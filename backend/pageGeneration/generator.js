const fs = require('fs');
const ejs =require('ejs');


var file ='C:/Users/krelo/Desktop/TW/krello/Proiect_WEB/backend/views/pages/mainPage.ejs';
var myFile = fs.readFileSync(file,'utf-8');
//GATHER DATA
var data ={
    "folder":
        {"files":[{"name":"1","extension":"aiff"},{"name":"12","extension":"aiff"},{"name":"123","extension":"aiff"},{"name":"1234","extension":"aiff"},{"name":"12345","extension":"asp"},{"name":"123456","extension":"doc"}]},
};




// COMPILE
var ret =ejs.compile(myFile)({"data":data});


    for(f in data.folder.files){
        console.log(f);
        let op = data.folder.files;
        console.log(op[f].name);
    }


fs.writeFileSync('../views/pages/test.html',ret);