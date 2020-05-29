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
        res.writeHead(404, 'No Access');    
        res.end();
    }
    else{
        var token = myVar[1];
        try{
            jwt.verify(token,PRIVATE_KEY);
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            let r =await renderMainPage(token);
            r.pipe(res);
            
        }
        catch(e){
            res.writeHead(404,'NO AUTHENTIFICATION' );    
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
    return new Promise(async (resolve)=>{
        var mypath = './views/pages/mainPage.ejs';//INGA TEACHED ME  
        var myFile = fs.readFileSync(mypath,'utf-8');

        const File = models.File;
        let auth_values = jwt.decode(token,PRIVATE_KEY);
    
        await File.find({id_user:auth_values.user},(err,files)=>{
            if(!err){
            }
        } ).then(async (listFiles)=>{
            data = {
                "folder":
                {
                    "files":[]
                }
            }
            for ( i in listFiles){
                let obj =listFiles[i].fileName.split('.');
                data.folder.files.push({"name":obj[0],"extension":obj[1],"idFile":listFiles[i].id_file});
            }
            
        
            var out = await ejs.compile(myFile)({"data":data});
            fs.writeFileSync('./views/pages/dummy.html',out);
            
            let stream = fs.createReadStream('./views/pages/dummy.html');
            resolve(stream);
        });
    });
    
}
module.exports={
    mainPage,
    renderMainPage
}