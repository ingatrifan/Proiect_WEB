const fs = require('fs');
const ejs =require('ejs');


var file ='C:/Users/krelo/Desktop/TW/krello/Proiect_WEB/backend/views/pages/mainPage.ejs';
var myFile = fs.readFileSync(file,'utf-8');
//GATHER DATA
var data ={
    "folders":
        {"name":"folder_1","files":[{"name":"test","extension":"aif"},{"name":"test1","extension":"aif"},{"name":"test2","extension":"aif"},{"name":"test","extension":"aif"},{"name":"test2","extension":"asp"},{"name":"test2","extension":"doc"}]},

};

// COMPILE
var ret =ejs.compile(myFile)({"data":data});

fs.writeFileSync('test.html',ret);