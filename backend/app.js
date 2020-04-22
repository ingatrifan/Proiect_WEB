//for demonstrative purposes
const http = require('http');
const url = require('url');
const httpStatusCode = require('http-status-codes');
const fs = require('fs');;
const { HTTPServer } = require('./utils/server');
const { router } = require('./routes/index');
/*endPointUtils.registerEndPoint('GET','/landing',(req,res) => {
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
});*/

const app = new HTTPServer(router);
app.listen();


