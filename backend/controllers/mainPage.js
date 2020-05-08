

const url = require('url');
const fs = require('fs');
const ejs =require('ejs');
const jwt = require('jsonwebtoken');
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
            //HERE EJS
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
    //
    var dec = jwt.decode(token);
    var values = dec.split(':');
    //values[0]:id / values[1]:pw

    var mypath = 'C:/Users/krelo/Desktop/TW/krello/Proiect_WEB/backend/views/pages/mainPage.ejs';//INGA TEACHED ME  
    var myFile = fs.readFileSync(mypath,'utf-8');
    
    var data ={
        "folder":
            {"files":[{"name":"1","extension":"aiff"},{"name":"123","extension":"aiff"},{"name":"1234","extension":"aiff"},{"name":"12345","extension":"asp"},{"name":"123456","extension":"doc"}]},
    };
    var out =ejs.compile(myFile)({"data":data});
    fs.writeFileSync('./views/pages/dummy.html',out);
    //other way didn't find

    console.log(out);
}
module.exports={
    mainPage   
}