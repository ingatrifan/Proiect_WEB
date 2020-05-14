const http = require('http');
const httpStatusCode = require('http-status-codes');
const pageRenderer = require('../routes/pageRendering');
const urlModule = require('url');
const mainPage = require('../routes/mainPage');
class HTTPServer {

    constructor(router) {
        this.PORT = 3000;
        this.router = router;
    }

    listen() {
        let server;
        let app = this  ;
        try {
            server = http.createServer((req, res) => {
                console.log(req.url);
                //THESE 3 LINES NEARLY BROKE ME INSANE, SEND HELP
                res.setHeader('Access-Control-Allow-Origin', '*');  
                res.setHeader('Access-Control-Allow-Methods', '*');
                res.setHeader('Access-Control-Allow-Headers', '*');
            
                if(urlModule.parse(req.url).pathname.split('?')[0]=='/mainPage.html'){
                
                    mainPage.mainPage(req,res);
                }   
                else if(req.method == 'GET' && urlModule.parse(req.url).pathname.indexOf('.')!== -1
                &&urlModule.parse(req.url).pathname.indexOf("mainPage.html")
                ) {
                    pageRenderer.pageRendering(req,res);
                }
                else {
                    app.router.route(req, res);
                }
            });
        } catch (err) {
            res.statusCode = httpStatusCode.INTERNAL_SERVER_ERROR;
            res.end();
        }
        server.listen(this.PORT);
        console.log('Listening on port:', this.PORT);
    }
}

module.exports = {
    HTTPServer
};