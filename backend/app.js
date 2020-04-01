//for demonstrative purposes
const http = require('http');
const url = require('url');
const httpStatusCode = require('http-status-codes');
const ejs = require('ejs');
const fs = require('fs');
const endPointUtils = require('./routes/endpoint_utilities');
const pages = require('./routes/pageRendering.js');

endPointUtils.registerEndPoint('GET','/landing',(req,res) => {
    let path =__dirname +'/views/ejs/landingPage/landingPage.ejs';
    let assetsPath = __dirname +'/views/assets/css';
    fs.readFile( path, {encoding:'utf-8', flag:'r'},function(error,data){
        if(error){
            res.writeHead(404);
            res.end(JSON.stringify(error));
        }
        else{
            res.writeHead(200,{'Content-Type': 'text/html'});
            let template = ejs.compile(data,{filename: path});
            let myCss= {
                headerStyle: fs.readFileSync(assetsPath + '/header.css','utf8'),
                footerStyle: fs.readFileSync(assetsPath + '/footer.css','utf8'),
                landingStyle: fs.readFileSync(assetsPath + '/landingPage.css','utf8'),
            };
            html = template({myCss: myCss});
            res.end(html);
        }
    });
});

const server =http.createServer( (req,res)=>{
    try {
        let reqUrlString = req.url;
        let pathName = url.parse(reqUrlString,true,false).pathname;
        let method = req.method;
    
        let handler = endPointUtils.getHandler(method,pathName);
        handler(req,res);
        //pages.pageRendering(res,req);
    }catch(err) {
        res.statusCode = httpStatusCode.INTERNAL_SERVER_ERROR;
        res.end(); 
    }   
});

process.on("uncaughtException",(err) =>{
    console.log("Caught error",err);
});

const PORT = 3000;
server.listen(PORT);
console.log('Listening on port: ',PORT);


