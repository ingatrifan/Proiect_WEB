

const url = require('url');
const fs = require('fs');
const ejs =require('ejs');
const jwt = require('jsonwebtoken');
const models = require('../models/index');
const PRIVATE_KEY = "SUPER_SECRET_KEY";

async function mainPage(req,res){
    try{
        var uri = url.parse(req.url).query;
        var values =uri.split('&')[0];
        var myVar= values.split('=');
    
    if(myVar[0]!='serverToken')
    {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });    
        res.write('INVALID URL');
        res.end();
    }
    else{
        var token = myVar[1];
        console.log('MAIN-PAGE',token);
        try{
            jwt.verify(token,PRIVATE_KEY);
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            
            await renderMainPage(token);
            let r = fs.createReadStream('./views/pages/dummy.html');
            r.pipe(res);
            
        }
        catch(e){
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });    
            
            res.write('NO AUTHENTIFICATION');
            res.end();
        }
    }
}
catch(e){
    
}
        
}



async function renderMainPage(token){
    //var dec = jwt.decode(token);
    
    //var values = dec;
    var mypath = 'C:/Users/krelo/Desktop/TW/krello/Proiect_WEB/backend/views/pages/mainPage.ejs';//INGA TEACHED ME  
    var myFile = fs.readFileSync(mypath,'utf-8');
    const File = models.File;
    let auth_values = jwt.decode(token,PRIVATE_KEY);
    let buffer = [];
    await File.find({id_user:auth_values.user},(err,files)=>{
        if(!err)
        buffer.push(files);
     } );
     var data ={
        "folder":
            {"files":[{"name":"1","extension":"aiff"},{"name":"123","extension":"aiff"},{"name":"1234","extension":"aiff"},{"name":"12345","extension":"asp"},{"name":"123456","extension":"doc"}]},
    };
     for(let i =0 ;i<buffer.length;i++){
         
         let values =buffer[0];
         for(let j =0; j<buffer[0].length;j++){
             let obj = buffer[0][j].id_file.split('.');
            
             data.folder.files.push({"name":obj[0],"extension":obj[1]});
             
         }  
         //data.folder.files.push({"name":values[0],"extension":values[1]});
     }
     //console.log(data.folder.files);
    
    
    var out =ejs.compile(myFile)({"data":data});
    fs.writeFileSync('./views/pages/dummy.html',out);

}
module.exports={
    mainPage
}