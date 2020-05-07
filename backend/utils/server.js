const http = require('http');
const httpStatusCode = require('http-status-codes');
const pageRenderer = require('../routes/pageRendering');
const urlModule = require('url');
class HTTPServer {

    constructor(router) {
        this.PORT = 3000;
        this.router = router;
    }

    listen() {
        let server;
        let app = this;
        try {
            server = http.createServer((req, res) => {
                console.log(req.method)
                console.log(req.url)
                if(req.method == 'GET' && urlModule.parse(req.url).pathname.indexOf('.')!== -1) {
                    pageRenderer.pageRendering(req,res);
                }
                else {
                    app.router.route(req, res);
                    res.end();
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